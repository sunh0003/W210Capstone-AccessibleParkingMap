# AccessiPark
## W210 Capstone Project
by Rachael Burns, Richard Ryu, Michelle Sun, and Hong Yang

## Mission Statement
Reduce street-level accessibility problems and find accessible parking easily

## So what is this?
We're creating an [accessible parking map](http://ec2-54-183-149-77.us-west-1.compute.amazonaws.com:3001/) that displays handicap signs and obstacles that are detected through our custom trained YOLOv5 model that's inspired by [Roboflow's YOLOv5 notebook](https://blog.roboflow.ai/how-to-train-yolov5-on-a-custom-dataset/)

## How are we doing it?

### Data
* Used [ArcGIS](https://www.esri.com/en-us/arcgis/products/arcgis-pro/overview) pro to extract all lat/long coordinates of downtown Denver
* Leveraged Google Street API to download all images (~200k) associated with the coordinates from the extracted listed above

![Downtown Denver](images/DDenver.png)

### Custom Labelling
* Used [labelImg](https://github.com/tzutalin/labelImg) to draw bounding boxes for 5 classes on 2500 images

<img src="images/classes.png" width="600" height="400" align="middle"/>

### System architecture

<img src="images/arch.png" width="800" height="500" align="middle"/>

### Model Methodology
* Inspired by [Roboflow's YOLOv5 notebook](https://blog.roboflow.ai/how-to-train-yolov5-on-a-custom-dataset/), we implemented YOLOv5 on our custom labelled images

* Applied **train** (70%) / **test** (30%) split on our dataset

* Leveraged [Google Colab](https://colab.research.google.com/github/tensorflow/examples/blob/master/courses/udacity_intro_to_tensorflow_for_deep_learning/l01c01_introduction_to_colab_and_python.ipynb) and [TensorFlow](https://www.tensorflow.org/tutorials) for both training and inference

* **mean Average Precision (mAP)** was used for model evaluation
<img src="images/mAP.png" width="700" height="150" align="middle"/>

* We won't go into much detail about YOLOv5 since this page is intended to explain how we were able to come up with AccessiPark map. For more information about YOLOv5, please visit [Roboflow's YOLOv5 blog](https://blog.roboflow.ai/yolov5-improvements-and-evaluation/)

* For inference, we used YOLOv5 pre-trained weights to detect 5 objects on ~200,000 images of downtown Denver

<img src="images/infer.png" width="500" height="500" align="middle"/>

### Feature Engineering

<img src="images/infers2.png" width="700" height="300" align="middle"/>

The bounding boxes from the inference above are saved in a csv format. Above is an example of the csv file in pandas DF. In order to plot this on our AccessiPark map, we've listed the necessary feature engineering below:

```def csv_par9(df, delta):
    for i in range(len(df)):
        df.loc[i, 'lat'] = float(df.loc[i, 'imgname'].split('-')[0])
        df.loc[i, 'long'] = float(df.loc[i, 'imgname'].split('-')[2]) * -1.0
        df.loc[i, 'angle'] = df.loc[i, 'imgname'].split('-')[3][:-4]
        result = search.by_coordinates(df.loc[i, 'lat'], df.loc[i, 'long'], radius=3)
        df.loc[i, 'zipcode'] = result[0].zipcode
        df.loc[i, 'zipcode2'] = result[1].zipcode
        if df.loc[i, 'xcenter'] <= 0.333333:
            df.loc[i, 'detect_loc'] = 'L'
            df.loc[i, 'new_lat'] = df.loc[i, 'lat'] + (delta * math.cos((math.pi / 180)*(float(df.loc[i, 'angle'])-90)))
            df.loc[i, 'new_long'] = df.loc[i, 'long'] + (delta * math.sin((math.pi / 180)*(float(df.loc[i, 'angle'])-90)))
        elif df.loc[i, 'xcenter'] > 0.666666:
            df.loc[i, 'detect_loc'] = 'R'
            df.loc[i, 'new_lat'] = df.loc[i, 'lat'] - (delta * math.cos((math.pi / 180)*(float(df.loc[i, 'angle']) -90)))
            df.loc[i, 'new_long'] = df.loc[i, 'long'] - (delta * math.sin((math.pi / 180)*(float(df.loc[i, 'angle']) -90)))
        else:
            df.loc[i, 'detect_loc'] = 'C'
            df.loc[i, 'new_lat'] = df.loc[i, 'lat']
            df.loc[i, 'new_long'] = df.loc[i, 'long']
    return df
```
* Transformation
  * Split 'imgname' into 'lat', 'long', 'angle'

  * Use uszipcode python package to search for the first 2 zipcodes that are associated within a 3 mile radius from each coordinate

  * Use 'xcenter' of the bounding box to determine the relative location (left, right, center) of the detcted object, and then apply adjustment based on the cosine and sine transformation of the 'lat' and 'long'

```def zip_df2(df):
    zip1 = list(df['zipcode'].unique())
    zip2 = list(df['zipcode2'].unique())
    all_zip = list(set(zip1 + zip2))
    for i in all_zip:
        temp_df = df[df["zipcode"] == i]
        temp_df2 = df[df["zipcode2"] == i]
        temp_final = pd.concat([temp_df, temp_df2])
        temp_final.drop_duplicates()
        temp_final.to_csv(i + '.csv', encoding = 'utf-8', index = False)
```
* Organize DataFrame by Zipcode
  * Organize inferences into CSV file by zipcodes

  * For full process from start to finish, please refer to the [ETL notebook](https://github.com/sunh0003/W210Capstone-AccessibleParkingMap/blob/master/ETL/Inf_Transform_Final.ipynb)

### AccessiPark Map

* 2 Docker Containers
  - Middleware - [Flask](https://flask.palletsprojects.com/en/1.1.x/)
  - Frontend - [React](https://reactjs.org/)

* [Base Web React UI Framework](https://baseweb.design/)

* [icons for objects](https://icons8.com/)

<img src="images/icons.png" width="300" height="300" align="middle"/>
