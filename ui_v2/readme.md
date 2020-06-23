Prerequisites: 

Docker installation (I used Docker Desktop Edge v2.1.3.0, most new-ish versions should work I assume).

A Google API Key with the Maps Javascript API enabled, instructions here: https://developers.google.com/maps/documentation/javascript/get-api-key

In frontend/src/key.js, put the following:

```
const key= "YOUR_SUPER_SECRET_KEY";

export default key;
```

To run both Flask and React parts of the UI, from this directory run the following:

```
bash run.bash
```

This will clear any running containers and start the Flask container, followed by the React container. 

The React container logs will be shown, and using ctrl-c will stop the React container.

The Flask container can be watched from another terminal with:

```
docker logs flask
```