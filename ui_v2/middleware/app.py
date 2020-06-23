from flask import Flask, jsonify, request, send_from_directory
import pandas as pd
import numpy as np
import requests
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

urls = ['https://www.denvergov.org/media/gis/DataCatalog/parking_meters/csv/parking_meters.csv']
#download data on startup
for url in urls:
    name = url.split('/')[-1]
    if not os.path.exists(name):
        response = requests.get(url)
        with open(name, 'wt') as f:
            f.write(response.text)

#load data into memory - todo - does this work at scale?
#if not, use sqlite or other local db
meters = pd.read_csv('parking_meters.csv')
active_meters = meters.loc[meters.POLE_STATUS=='Active',]
meter_locs = active_meters[['LATITUDE', 'LONGITUDE']].groupby(['LATITUDE', 'LONGITUDE']).apply(len)
global_meters = [(lat,lng) for lat,lng in meter_locs.index.tolist()]
print('ready')

def lin_dist(a,b):
    #TODO - fix this
    return np.sqrt((b[0]-a[0])**2+(b[1]-a[1])**2)

@app.route("/api/get_icons")
def get_icons():
    #TODO - get center from request
    center = (39.74917208,-104.9870462)
    #Get 100 closest parking meters to center - overloads to have all at once
    #TODO - replace this with a radius/more intelligently chosen threshold
    m_lens = [(coord, lin_dist(coord, center)) for coord in global_meters]
    m_lens = sorted(m_lens, key = lambda x: x[1])[:5]
    meters = [m[0] for m in m_lens]

    #samples for demo purposes
    hydrants = [ (39.74917208,-104.9870462)]
    wheelchairs = [(39.74755556,-104.98428899999999)]
    lamps = [(39.74917611,-104.98178429999999), (39.74,-104.9870462)]
    
    out=dict(center=center, 
        meters=meters, 
        hydrants=hydrants, 
        wheelchairs=wheelchairs, 
        lamps=lamps)
    return jsonify(out)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')