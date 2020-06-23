#!/bin/bash
docker kill flask
docker kill react

cd middleware
docker build -t flask:latest .
docker run -d  --name flask --rm  -p 5000:5000 -v ${PWD}:/app flask:latest

cd ../frontend
docker build -t react:dev .
docker run  -it --name react --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true react:dev
