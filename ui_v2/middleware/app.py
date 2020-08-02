from flask import Flask, jsonify, request, send_from_directory
import pandas as pd
import numpy as np
import requests
import os
from flask_cors import CORS
import json
from collections import defaultdict

app = Flask(__name__)
CORS(app)
PATH = 'google_thresh/'

out = pd.DataFrame()
for f in os.listdir(PATH):
    out = pd.concat([out, pd.read_csv(PATH+f)])
out=out[['zipcode', 'new_lat', 'new_long', 'class']]

objects = pd.read_csv('initial_20200630.csv').drop_duplicates()[['ZIPCODE','LATITUDE','LONGITUDE','CLASS']]
objects.columns=['zipcode', 'new_lat', 'new_long', 'class']
out = pd.concat([out, objects])

with open('sidewalks.json', 'rt') as f:
    sidewalks = json.loads(f.read())

with open('moratorium_streets.json', 'rt') as f:
    m_streets = json.loads(f.read())

path_transform = []
for k,v in sidewalks.items():
    for r in v:
        rec = {'zipcode':k, 
               'start_lat':r[0]['lat'], 
               'start_long':r[0]['lng'], 
               'end_lat': r[-1]['lat'],
               'end_long': r[-1]['lng'],
               'class':'sw', 
               'path':r}
        path_transform.append(rec)
for k,v in m_streets.items():
    for r in v:
        rec = {'zipcode':k, 
               'start_lat':r[0]['lat'], 
               'start_long':r[0]['lng'], 
               'end_lat': r[-1]['lat'],
               'end_long': r[-1]['lng'],
               'class':'mst', 
               'path':r}
        path_transform.append(rec)
paths = pd.DataFrame(path_transform)

with open('curb_ramps.json', 'rt') as f:
    ramps = json.loads(f.read())

ramps_transform = []
for k,v in ramps.items():
    for r in v:
        rec = {'zipcode':k, 'new_lat':r['lat'], 'new_long':r['lng'], 'class':6}
        ramps_transform.append(rec)

out = pd.concat([out, pd.DataFrame(ramps_transform)])
out['path'] = None

with open('facilities.json', 'rt') as f:
    facilities = json.loads(f.read())

fac_transform = []
for k,v in facilities.items():
    for r in v:
        try:
            rec = {'zipcode':k, 'new_lat':r[0][0][0]['lat'], 'new_long':r[0][0][0]['lng'], 'class':7, 'path':r}
        except:
            rec = {'zipcode':k, 'new_lat':r[0][0]['lat'], 'new_long':r[0][0]['lng'], 'class':7, 'path':r}
        fac_transform.append(rec)
out = pd.concat([out, pd.DataFrame(fac_transform)])

def zip_df(df):
    '''for later'''
    for i in df["zipcode"].unique():
        temp_df = df[df["zipcode"] == i]
        temp_df.to_csv(i + '.csv', encoding = 'utf-8', index = False)

def squared_linear_distance(lat, long, center): 
    return (lat - center['lat'])**2 + (long - center['lng'])**2

def get_radius_objects(center, k):
    classes = defaultdict(list)
    cp = out.copy()
    cp['dist'] = squared_linear_distance(cp['new_lat'], cp['new_long'], center)
    slc = cp.sort_values(by='dist', ascending=True)[:k]
    for i in range(7):
        print(i)
        gen = slc.loc[slc['class']==i,].groupby(['new_lat', 'new_long']).apply(len).index.tolist()
        classes[i] += [(lat,lng) for lat,lng in gen]
        print(len(classes[i]))
    classes[7] = [p for p in slc.loc[slc['class']==7,].path.tolist()]
    return classes

def get_radius_paths(center, k):
    cp = paths.copy()
    cp['dist_st'] = squared_linear_distance(cp['start_lat'], cp['start_long'], center)
    cp['dist_end'] = squared_linear_distance(cp['end_lat'], cp['end_long'], center)
    cp['min_dist'] = cp[['dist_st','dist_end']].min(axis=1)
    slc = cp.sort_values(by='min_dist', ascending=True)[:k]
    sw = [p for p in slc.loc[slc['class']=='sw',].path.tolist()]
    mst = [p for p in slc.loc[slc['class']=='mst',].path.tolist()]
    return sw, mst

@app.route("/api/get_lookup")
def get_lookup():
    '''this way we only have to maintain in 1 place'''
    return jsonify(lookup)

@app.route("/api/get_icons/<zipc>", methods=['GET', 'POST'])
def get_icons(zipc):
    center = request.json['center']
    #lamp,signh,fh,nopark,stop,meters
    objs = get_radius_objects(center, 1000)
    sw,mst = get_radius_paths(center, 1000)
    
    out=dict(
        meters = objs[5], 
        hydrants = objs[2], 
        wheelchairs = objs[1], 
        lamps = objs[0],
        nopark = objs[3]+objs[4],
        sidewalks= sw,
        m_streets = mst,
        ramps = objs[6],
        facilities = objs[7])

    return jsonify(out)

@app.route("/api/get_polygons/<zipc>", methods=['GET', 'POST'])
def get_polygons(zipc):
    '''todo - make these 2 routes'''
    pass


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
