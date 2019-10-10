import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, {Popup}from "react-map-gl";

// map functions
import { useMapRef, useMapApis } from "./maps";
// tracks
import { loadTracks, useMapTagSelection } from "./tracks";
// constants
import {MAP_ACCESS_TOKEN, MAP_STYLE } from './constants';
// component
import {OperationData} from './OperationData';


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

  const [selectedOperation, setSelectedOperation]: any = useState(null);

  const handleClick =(e: any) => {
    if (e.features && e.features.length) {
      const feature = e.features[0];
      if (feature.id) {
        feature.latitude = e.lngLat[1];
        feature.longitude = e.lngLat[0];
        setSelectedOperation(feature);
      }
    }
  }
  
  useMapTagSelection(selectedOperation, mapApis)

  return (
    <div>
      <ReactMapGL
        {...viewport}
        onViewportChange={viewport => setViewport(viewport)}
        mapboxApiAccessToken={MAP_ACCESS_TOKEN}
        mapStyle={MAP_STYLE}
        ref={mapRef}
        onClick={handleClick}
      >{selectedOperation && <Popup
      latitude={selectedOperation.latitude}
      longitude={selectedOperation.longitude}
      closeButton={true}
      closeOnClick={false}
      onClose={() => setSelectedOperation(null)}
       >
      <OperationData selectedOperation={selectedOperation} />
    </Popup>}</ReactMapGL>
    </div>
  );
};
