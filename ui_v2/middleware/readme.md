To run: 
```
docker build -t flask:latest .
docker run -it  --rm  -p 5000:5000 -v ${PWD}/data:/data flask
```