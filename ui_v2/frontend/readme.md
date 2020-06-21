To run:
```
docker build -t react:dev .
docker run  -it --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true react:dev
```

{/* Note for reference:
<Map
google={this.props.google}
onReady={this.autoCenterMap}
/>

autoCenterMap = ({ google }, map) => {
    this.loadGeoJson(map);
*code continues*
  }

loadGeoJson = async (map) => {
    const geojsonRoutes = await this.getRoutes(feed_code);
    const geojsonEnvelope = await this.getEnvelope(feed_code)
    map.data.addGeoJson(geojsonEnvelope);
    map.data.addGeoJson(geojsonRoutes); // # load geojson layer
} */}