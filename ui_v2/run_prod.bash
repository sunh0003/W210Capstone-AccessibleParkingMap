#!/bin/bash
sudo docker kill flask_prod
sudo docker kill react_prod

cd frontend
sudo docker build -f Dockerfile.prod -t react:prod .
sudo docker run -d --name react_prod --rm -p 3001:80 react:prod

cd ../middleware
sudo docker build -f Dockerfile.prod -t flask:prod .
sudo docker run -d  --name flask_prod --rm  -p 5000:5000 flask:latest


