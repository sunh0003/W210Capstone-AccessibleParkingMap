#!/bin/bash
docker kill flask_prod
docker kill react_prod

cd frontend
docker build -f Dockerfile.prod -t react:prod .
docker run -it --name react_prod --rm -p 3001:80 react:prod

cd ../middleware
docker build -f Dockerfile.prod -t flask:prod .
docker run -d  --name flask_prod --rm  -p 5000:5000 flask:latest


