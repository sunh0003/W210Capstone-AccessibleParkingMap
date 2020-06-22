#!/bin/bash
cd middleware
docker kill flask
docker build -t flask:latest .
docker run -d  --name flask --rm  -p 5000:5000 -v ${PWD}/data:/data flask:latest

cd ../frontend
docker build -t react:dev .
docker run  -it --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true react:dev
