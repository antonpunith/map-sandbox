import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL from "react-map-gl";

import { useMapRef, useMapApis } from "./maps";
import { loadTracks } from "./tracks";

const MAP_ACCESS_TOKEN =
  "pk.eyJ1IjoiamFtZXMtZW1zIiwiYSI6ImNqbDI3bDJhYzFuYnUza3F0eWNlZDAydjYifQ.RFbQDC7kOaW0NBLl9zD4FQ";
const mapStyle = "mapbox://styles/james-ems/cjsvs7gth4k3s1fpm3y7qzevk";

export const Map = () => {
  const [viewport, setViewport] : any = useState({
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
      loadTracks(mapApis)
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
