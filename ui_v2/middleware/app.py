from flask import Flask, jsonify, request, send_from_directory
import pandas as pd
import numpy as np
import requests
import os
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

with open('sidewalks.json', 'rt') as f:
    sidewalks = json.loads(f.read())

with open('moratorium_streets.json', 'rt') as f:
    m_streets = json.loads(f.read())

meters = pd.read_csv('parking_meter_zip.csv').drop_duplicates()

objects = pd.read_csv('initial_20200630.csv').drop_duplicates()
# 7/1 save df by zipcode in csv
def zip_df(df):
    for i in df["zipcode"].unique():
        temp_df = df[df["zipcode"] == i]
        temp_df.to_csv(i + '.csv', encoding = 'utf-8', index = False)
        
print('ready!')

def get_zip(df, zipc):
    gen = df.loc[df.ZIPCODE == zipc,].groupby(['LATITUDE', 'LONGITUDE']).apply(len).index.tolist()
    return [(lat,lng) for lat,lng in gen]

def get_zip_objects(df, zipc):
    print(df.shape)
    df = df.loc[df.ZIPCODE == zipc,]
    print(df.shape)
    classes = []
    for i in range(5):
        gen = df.loc[df.CLASS==i,].groupby(['LATITUDE', 'LONGITUDE']).apply(len).index.tolist()
        classes.append([(lat,lng) for lat,lng in gen])
    return classes

def lin_dist(a,b):
    #TODO - fix this
    return np.sqrt((b[0]-a[0])**2+(b[1]-a[1])**2)

@app.route("/api/get_icons")
def get_icons():
    #TODO - get zip from request
    zipc = 80205
    #sw = sidewalks[zipc]
    print(sidewalks.keys())
    zip_meters = get_zip(meters, zipc)
    print(len(zip_meters), 'meters in zip', zipc)
    lamp,signh,fh,nopark,stop = get_zip_objects(objects, zipc)
    sw = sidewalks.get(str(zipc), [])
    mst = m_streets.get(str(zipc), [])
    print(len(lamp), 'lamps in zip')
    print(len(signh), 'signh in zip')
    print(len(fh), 'fh in zip')
    print(len(nopark), 'nopark in zip')
    print(len(stop), 'stop in zip')
    print(len(sw), 'sidewalks in zip')
    
    #TODO - get center from request
    center = dict(lat=39.76895395, lng=-104.9733459)
    # m_lens = [(coord, lin_dist(coord, center)) for coord in global_meters]
    # m_lens = sorted(m_lens, key = lambda x: x[1])[:5]
    # meters = [m[0] for m in m_lens]
    #samples for demo purposes
    
    out=dict(center=center, 
        meters=zip_meters, 
        hydrants=fh, 
        wheelchairs=signh, 
        lamps=lamp,
        nopark = stop+nopark,
        sidewalks= sw,
        m_streets = mst)

    return jsonify(out)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')