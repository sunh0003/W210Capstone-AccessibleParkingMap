from flask import Flask, jsonify, request, send_from_directory
import pandas as pd
import numpy as np

app = Flask(__name__)
meters = pd.read_csv('../../parking_meters.csv')
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
    #TODO - toggle this threshold
    m_lens = [(coord, lin_dist(coord, center)) for coord in global_meters]
    m_lens = sorted(m_lens, key = lambda x: x[1])[:1000]
    #TODO - these should come from shared db
    meters = [m[0] for m in m_lens]
    hydrants = [(39.74754878,-104.9925866)]
    wheelchairs = [(39.74917208,-104.9870462), (39.74755556,-104.98428899999999)]
    lamps = [(39.74917611,-104.98178429999999)]
    
    return jsonify(dict(center=center, meters=meters, hydrants=hydrants, wheelchairs=wheelchairs, lamps=lamps))