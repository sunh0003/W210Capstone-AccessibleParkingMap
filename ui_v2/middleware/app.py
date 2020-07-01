from flask import Flask, jsonify, request, send_from_directory
import pandas as pd
import numpy as np
import requests
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# urls = ['https://www.denvergov.org/media/gis/DataCatalog/parking_meters/csv/parking_meters.csv']
# #download data on startup
# for url in urls:
#     name = url.split('/')[-1]
#     if not os.path.exists(name):
#         response = requests.get(url)
#         with open(name, 'wt') as f:
#             f.write(response.text)

#load data into memory - todo - does this work at scale?
#if not, use sqlite or other local db
meters = pd.read_csv('parking_meter_zip.csv').drop_duplicates()

objects = pd.read_csv('initial_20200630.csv').drop_duplicates()

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
    zipc = 80264
    zip_meters = get_zip(meters, zipc)
    print(len(zip_meters), 'meters in zip', zipc)
    lamp,signh,fh,nopark,stop = get_zip_objects(objects, zipc)
    print(len(lamp), 'lamps in zip')
    print(len(signh), 'signh in zip')
    print(len(fh), 'fh in zip')
    print(len(nopark), 'nopark in zip')
    print(len(stop), 'stop in zip')
    #TODO - get center from request
    center = (39.739492999999996,-104.982258)
    
    # m_lens = [(coord, lin_dist(coord, center)) for coord in global_meters]
    # m_lens = sorted(m_lens, key = lambda x: x[1])[:5]
    # meters = [m[0] for m in m_lens]
    #samples for demo purposes
    
    out=dict(center=center, 
        meters=zip_meters, 
        hydrants=fh, 
        wheelchairs=signh, 
        lamps=lamp,
        nopark = stop+nopark)

    return jsonify(out)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')