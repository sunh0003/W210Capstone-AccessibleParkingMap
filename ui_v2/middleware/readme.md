To run Flask container alone:
```
docker build -t flask:latest .
docker run -it  --rm  -p 5000:5000 -v ${PWD}/middleware:/app -v ${PWD}/data:/data flask
```
To access, go to http://localhost:5000/api/get_icons (or another endpoint)