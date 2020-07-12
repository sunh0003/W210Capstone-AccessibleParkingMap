from flask import Flask, jsonify, request, send_from_directory
import pandas as pd
import numpy as np
import requests
import os
from flask_cors import CORS
import json
from uszipcode import SearchEngine, SimpleZipcode, Zipcode
search = SearchEngine()

app = Flask(__name__)
CORS(app)

PATH = '20200712csvp2'

with open('sidewalks.json', 'rt') as f:
    sidewalks = json.loads(f.read())

with open('moratorium_streets.json', 'rt') as f:
    m_streets = json.loads(f.read())

with open('curb_ramps.json', 'rt') as f:
    ramps = json.loads(f.read())

# objects = pd.read_csv('initial_20200630.csv').drop_duplicates()
# print(objects.shape, 'objects')

def zip_df(df):
    '''for later'''
    for i in df["zipcode"].unique():
        temp_df = df[df["zipcode"] == i]
        temp_df.to_csv(i + '.csv', encoding = 'utf-8', index = False)

print('ready!')

def get_zip_objects(zipc):
    df = pd.read_csv(f'{PATH}/{zipc}.csv')
    print(df.shape)
    classes = []
    for i in range(6):
        gen = df.loc[df['class']==i,].groupby(['lat', 'long']).apply(len).index.tolist()
        classes.append([(lat,lng) for lat,lng in gen])
    return classes

def lin_dist(a,b):
    #TODO - fix this
    return np.sqrt((b[0]-a[0])**2+(b[1]-a[1])**2)

@app.route("/api/get_zip", methods=['POST'])
def get_zip():
    ct = request.json['center']
    result = search.by_coordinates(ct['lat'], ct['lng'], radius=3)
    return jsonify(result[0].zipcode)

@app.route("/api/get_icons/<zipc>", methods=['GET', 'POST'])
def get_icons(zipc):
    lamp,signh,fh,nopark,stop,meters = get_zip_objects(zipc)
    sw = sidewalks.get(str(zipc), [])
    mst = m_streets.get(str(zipc), [])
    rmp = ramps.get(str(zipc), [])
    print(len(lamp), 'lamps in zip')
    print(len(signh), 'signh in zip')
    print(len(fh), 'fh in zip')
    print(len(nopark), 'nopark in zip')
    print(len(stop), 'stop in zip')
    print(len(sw), 'sidewalks in zip')
    print(len(meters), 'meters in zip', zipc)

    out=dict(
        meters=meters,
        hydrants=fh,
        wheelchairs=signh,
        lamps=lamp,
        nopark = stop+nopark,
        sidewalks= sw,
        m_streets = mst,
        ramps=rmp)

    return jsonify(out)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
