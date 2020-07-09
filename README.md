# AccessiPark
### W210 Capstone Project
by Rachael Burns, Richard Ryu, Michelle Sun, and Hong Yang 

## Missiong Statement
Reduce street-level accessibility problems and find accessible parking easily

## Data
* Used ArcGIS pro to extract all lat/long coordinates of downtown denver
* Leveraged Google Street API to download all images (~200k) associated with the coordinates from the extracted listed above

![Downtown Denver](images/DDenver.png)

## Custom Labelling
* Used [labelImg](https://github.com/tzutalin/labelImg) to draw bounding boxes for 5 classes on 2500 images
lamp
sign-h
fire hydrants
no parking
stop sign


## Model Methodology
* Inspired by Roboflow's YOLOv5 notebook (link), we were able to implement YOLOv5 on our custom labelled images.

We split the data (Denver downtown area) into train/test/validation with 70/30/30 ratio. Two models (1) EfficientDet (2) yolo v5 were trained with custome dataset using TRANSFER LEARNING  with pre-train weight. These two models are choosen due to small model size and less parameters to train (less time to train). For training, we use TensorFlow with Google Colab and extract the weights for model inference. In terms of model performance, mean Average precious (mAP) is used as model metrics to evaluation model performance. model Yolo v5 has higher model performance compared to efficientDet (mAP@0.5 = 63  for yolo v5 model & mAP@0.5=0.45 for efficientDet model).

objectdetector.jpeg
efficientdet.png
sampleinfer.png

Inference was conducted using the yolo v5 trained weights and detect objects (5 classes) with 200,000 images (Denver outside downtown area). The results are summarized in a csv file with object latitude, longitude, confidence leve, bounding box coordinates. Some sample inference output are shown below. This csv file is fed to product pipeline and plot icons on google map for user visulization.


## Website

testing git
