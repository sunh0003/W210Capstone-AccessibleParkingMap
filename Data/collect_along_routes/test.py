
#CREDITS: https://github.com/paloukari/road-scanner/blob/master/data_extraction/Training%20Routes.ipynb
import os
import requests
import shutil
import numpy as np

#Supporting functions
def get_total_distance(routes_obj):
    return routes_obj.json()['routes'][0]['legs'][0]['distance']['value']

def get_lat_lng(routes_obj):
    lat_lng = []
    steps = routes_obj.json()['routes'][0]['legs'][0]['steps']
    for step in steps:
        end = step['end_location']
        start = step['start_location']
        lat_lng += [(start['lat'],start['lng']),(end['lat'],end['lng'])]
    return lat_lng

def create_path(points):
    path = 'path='
    for i in points:
        path += str(i[0]) + ',' + str(i[1]) + '|'
    return path[:-1] #remove last '|'

def get_coords(r,points):
    for i in r.json()['snappedPoints']:
        points += [(i['location']['latitude'],i['location']['longitude'])]
    return points

def get_snapped_points(unique_points_interpolated,key,BASE_URL_SNAP = 'https://roads.googleapis.com/v1/snapToRoads?',interpolate = '&interpolate=true'):
    '''calls google roads api to get the nearest road position to a point'''
    points = []
    k = 0
    coords_list = []
    while k <= len(unique_points_interpolated)-1:
        coords_list += [unique_points_interpolated[k]]
        if (len(coords_list)%100==0) or (k+1==len(unique_points_interpolated)): #When we have 100 points or we reach the end of the list.
            path = create_path(coords_list)
            url = BASE_URL_SNAP + path + interpolate + key
            r = requests.get(url)
            print(r.text)
            points += get_coords(r,points)
            coords_list = []
        k += 1
    return(points)

#TODO - toggle separation_mts to find optimal.
def interpolate_coordinates(distance, lat_lng, k, separation_mts = 100):
    unique_points = list(set(lat_lng))
    n = max([1,round((distance/separation_mts)/len(unique_points))])
    print(n)
    unique_points_interpolated = []
    for i in range(len(unique_points)-1):
        unique_points_interpolated += list(map(tuple,np.linspace(unique_points[i],unique_points[i+1],n)))
    unique_points_interpolated = sorted(list(set(unique_points_interpolated)), key = lambda x: x[0])
    print('INTER', unique_points_interpolated)
    if n > 1: #If we have any new points to snap. 
        results = get_snapped_points(unique_points_interpolated,k)
        return results
    else:
        return unique_points_interpolated

def create_image(x, folder_name):
    for heading in range(0,4):
        lat=x[0]
        lng=x[1]
        heading=str(90*heading)
        query='https://maps.googleapis.com/maps/api/streetview?size=400x400&location=%s,%s&fov=90&heading=%s&pitch=10%s' % (str(lat),str(lng),heading,KEY)
        page=requests.get(query)
#         filename='%s-%s-%s-%s-%s.jpg' %(origin,destination,str(lat),str(lng),heading)
        filename='%s-%s-%s-%s.jpg' %(folder_name,str(lat),str(lng),heading)

        if not os.path.exists(filename+".txt") or os.path.getsize(filename)<5*10^3:
            f = open(filename,'wb')
            f.write(page.content)    
            f.close()

def download_pictures(origin, destination, category, folder_name, waypoints=None):
    
    #Get interpolated coordinates
    if waypoints == None:
        url = BASE_URL_DIRECTIONS + 'origin=' + origin + '&' + 'destination=' + destination + '&' + KEY
    else:
        url = BASE_URL_DIRECTIONS + 'origin=' + origin + '&' + 'destination=' + destination + '&' + waypoints + KEY
    r = requests.get(url)
    upi = interpolate_coordinates(get_total_distance(r),get_lat_lng(r),KEY)
    #Download pictures
    if os.path.exists(folder_name):
        shutil.rmtree(folder_name)
    os.makedirs(folder_name)    
    os.chdir(folder_name)
    org_dest_string='%s-%s' %(origin,destination)
    
    for i in range(len(upi)):
        create_image(upi[i], folder_name)


origins=['1717+Champa+St,+Denver,+CO+80202']
destinations=['321+17th+St,+Denver,+CO+80202']

#TODO - put key somewhere safe
kk = 'AIzaSyDSqApHsSdl6Nv7eQrgN8Z3nLWStEGwUJM'

BASE_URL_DIRECTIONS = 'https://maps.googleapis.com/maps/api/directions/json?'
KEY = '&key=' + kk

for o,d in zip(origins, destinations):
    download_pictures(o,d,'demo', 'output')