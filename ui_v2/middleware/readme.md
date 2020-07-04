To run Flask container alone, from middleware directory:
```
docker build -t flask:latest .
docker run -it  --rm  -p 5000:5000 -v ${PWD}:/app flask
```
To access, go to http://localhost:5000/api/get_icons (or another endpoint)