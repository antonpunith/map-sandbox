import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL from "react-map-gl";

import { useMapRef, useMapApis } from "./functions";

const MAP_ACCESS_TOKEN =
  "pk.eyJ1IjoiamFtZXMtZW1zIiwiYSI6ImNqbDI3bDJhYzFuYnUza3F0eWNlZDAydjYifQ.RFbQDC7kOaW0NBLl9zD4FQ";
const mapStyle = "mapbox://styles/james-ems/cjsvs7gth4k3s1fpm3y7qzevk";

export const Map = () => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: window.innerHeight,
    latitude: 40.777245,
    longitude: -73.872608,
    zoom: 8
  });

  const [mapNode, mapRef] = useMapRef();
  const mapApis = useMapApis(mapNode);

  useEffect(() => {
    if (mapApis) {
      // add mapbox tile
      mapApis.addSource("track_20190524", {
        type: "vector",
        url: "mapbox://ems-webapps.panynj_20190524"
      });
      setTimeout(() => {
        mapApis.addLayer({
          id: "tracks",
          type: "line",
          source: `track_20190524`,
          "source-layer": `tracks_20190524`,
          paint: {
            "line-color": [
              "case",
              ["==", ["get", "operationType"], "Departure"],
              "#8c54ff",
              ["==", ["get", "operationType"], "Arrival"],
              "#ea702e",
              ["==", ["get", "operationType"], "Overflight"],
              "#5aa700",
              ["==", ["get", "operationType"], "TouchAndGo"],
              "#5aaafa",
              "hsl(0, 100%, 100%)"
            ],
            "line-opacity": 0.4,
            "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.5, 12, 5]
          }
        });
      }, 600);
    }
  }, [mapApis]);

  return (
    <div>
      <ReactMapGL
        {...viewport}
        onViewportChange={viewport => setViewport(viewport)}
        mapboxApiAccessToken={MAP_ACCESS_TOKEN}
        mapStyle={mapStyle}
        ref={mapRef}
        onClick={e => {
          console.log(e.features);
        }}
      />
    </div>
  );
};
