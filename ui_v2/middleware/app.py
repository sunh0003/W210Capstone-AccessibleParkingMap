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

PATH = 'google_full'

#wide coverage to fill in for 80205
extra_objects = pd.read_csv('initial_20200630.csv').drop_duplicates()

lookup = {
    80294: [80294, 80202, 80205],
    80265: [80202, 80265, 80295, 80294],
    80299: [80299, 80202, 80293, 80265, 80290],
    80293: [80293, 80202, 80299, 80290],
    80290: [80290, 80202, 80264, 80203],
    80264: [80264, 80290, 80202, 80203],
    80203: [80203, 80264],
    80257: [80257, 80205, 80202],
    80202: [80202, 80264, 80290, 80203]
}

with open('sidewalks.json', 'rt') as f:
    sidewalks = json.loads(f.read())

with open('moratorium_streets.json', 'rt') as f:
    m_streets = json.loads(f.read())

with open('curb_ramps.json', 'rt') as f:
    ramps = json.loads(f.read())

with open('facilities.json', 'rt') as f:
    facilities = json.loads(f.read())

# objects = pd.read_csv('initial_20200630.csv').drop_duplicates()
# print(objects.shape, 'objects')

def zip_df(df):
    '''for later'''
    for i in df["zipcode"].unique():
        temp_df = df[df["zipcode"] == i]
        temp_df.to_csv(i + '.csv', encoding = 'utf-8', index = False)
        
print('ready!')

def get_zip_objects(zipc):
    classes = defaultdict(list)
    for z in lookup.get(int(zipc), [int(zipc)]):
        df = pd.read_csv(f'{PATH}/{z}.csv')
        for i in range(6):
            gen = df.loc[df['class']==i,].groupby(['new_lat', 'new_long']).apply(len).index.tolist()
            if zipc in ['80205', '80257']:
                gen += extra_objects.loc[extra_objects.CLASS==i,].groupby(['LATITUDE', 'LONGITUDE']).apply(len).index.tolist()
            classes[i] += [(lat,lng) for lat,lng in gen]
    return classes

def get_zip_json(zipc):
    classes = defaultdict(list)
    for z in lookup.get(int(zipc), [int(zipc)]):
        classes['sw'] += sidewalks.get(str(z), [])
        classes['mst'] += m_streets.get(str(z), [])
        classes['rmp'] += ramps.get(str(z), [])
        classes['fac'] += facilities.get(str(z), [])
    return classes
    
@app.route("/api/get_icons/<zipc>", methods=['GET', 'POST'])
def get_icons(zipc):
    #lamp,signh,fh,nopark,stop,meters
    objs = get_zip_objects(zipc)
    pub = get_zip_json(zipc)
    
    out=dict(
        meters=objs[5], 
        hydrants=objs[2], 
        wheelchairs=objs[1], 
        lamps=objs[0],
        nopark = objs[3]+objs[4],
        sidewalks= pub['sw'],
        m_streets = pub['mst'],
        ramps = pub['rmp'],
        facilities = pub['fac'])

    return jsonify(out)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')