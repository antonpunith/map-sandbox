import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Popup } from "react-map-gl";

// map functions
import { useMapRef, useMapApis } from "./maps";
// tracks
import { loadTracks, useMapTagSelection } from "./tracks";
// constants
import { MAP_ACCESS_TOKEN, MAP_STYLE } from "./constants";
// component
import { OperationData } from "./OperationData";

export const Map = () => {
  const [viewport, setViewport]: any = useState({
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
      loadTracks(mapApis);
    }
  }, [mapApis]);

  const [selectedOperation, setSelectedOperation]: any = useState(null);

  const handleClick = (e: any) => {
    if (e.features && e.features.length && e.features[0].id) {
      // there are feaures at the clicked location
      const feature = e.features[0];
      feature.latitude = e.lngLat[1];
      feature.longitude = e.lngLat[0];
      setSelectedOperation(feature);
    } else {
      if (mapApis) {
        for (let distance = 1; distance <= 10; distance++) {
          // @ts-ignore
          var features = mapApis.queryRenderedFeatures(
            [
              [e.point[0] - distance, e.point[1] - distance],
              [e.point[0] + distance, e.point[1] + distance]
            ],
            { layers: ["tracks"] }
          );
          if (features.length && features[0].id) {
            const feature = features[0];
            feature.latitude = e.lngLat[1];
            feature.longitude = e.lngLat[0];
            setSelectedOperation(feature);
            console.log(distance);
            break;
          }
        }
      }
    }
  };

  useMapTagSelection(selectedOperation, mapApis);

  return (
    <div className="react-map">
      <ReactMapGL
        {...viewport}
        onViewportChange={viewport => setViewport(viewport)}
        mapboxApiAccessToken={MAP_ACCESS_TOKEN}
        mapStyle={MAP_STYLE}
        ref={mapRef}
        onClick={handleClick}
      >
        {selectedOperation && (
          <Popup
            latitude={selectedOperation.latitude}
            longitude={selectedOperation.longitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setSelectedOperation(null)}
            tipSize={0}
          >
            <OperationData selectedOperation={selectedOperation} />
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
};
