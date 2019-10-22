import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Popup } from "react-map-gl";
// import { debounce } from "debounce";

// map functions
import { useMapRef, useMapApis } from "./maps";
// tracks
import { loadTracks, useMapSelection, useMapHover, useMapMultiSelect } from "./tracks";
// constants
import { MAP_ACCESS_TOKEN, MAP_STYLE, DATES } from "./constants";
// component
import { OperationData } from "./OperationData";
import { debounce } from "debounce";

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

  const [selectedOperations, setSelectedOperation]: any = useState([]);
  const [showSelected, setShowSelected] = useState(false);
  const [hoveredOperation, setHoveredOperation]: any = useState(null);

  const handleClick = (e: any) => {
    if (hoveredOperation) {
      setShowSelected(true);
      setSelectedOperation(hoveredOperation);
      return;
    }

    if (mapApis) {
      for (let distance = 0; distance <= 10; distance++) {
        // @ts-ignore
        const features = mapApis.queryRenderedFeatures(
          [
            [e.point[0] - distance, e.point[1] - distance],
            [e.point[0] + distance, e.point[1] + distance]
          ],
          {
            layers: DATES.map(date => `operations_${date}`),
            filter: [
              "any",
              ["==", ["get", "operationType"], "Departure"],
              ["==", ["get", "operationType"], "Arrival"]
            ]
          }
        );
        if (features.length && features[0].id) {
          const feature = features[0];
          feature.latitude = e.lngLat[1];
          feature.longitude = e.lngLat[0];
          setShowSelected(true);
          setSelectedOperation([feature]);
          break;
        } else {
          setSelectedOperation([]);
          setShowSelected(false);
        }
      }
    }
  };
  const handleHover = (e: any) => {
    if (viewport.zoom >= 11 && viewport.zoom <= 18 && mapApis) {
      for (let distance = 0; distance <= 5; distance++) {
        // @ts-ignore
        const features = mapApis.queryRenderedFeatures(
          [
            [e.point[0] - distance, e.point[1] - distance],
            [e.point[0] + distance, e.point[1] + distance]
          ],
          {
            layers: DATES.map(date => `operations_${date}`),
            filter: [
              "any",
              ["==", ["get", "operationType"], "Departure"],
              ["==", ["get", "operationType"], "Arrival"]
            ]
          }
        );
        if (features.length) {
          const feature = features[0];
          feature.latitude = e.lngLat[1];
          feature.longitude = e.lngLat[0];
          setHoveredOperation(feature);
        } else {
          setHoveredOperation(null);
        }
      }
    } else {
      // removing hovered when zoom is not set
      if (hoveredOperation) {
        setHoveredOperation(null);
      }
    }
  };

  useMapSelection(selectedOperations, mapApis);
  useMapHover(hoveredOperation, mapApis);

  useMapMultiSelect(mapNode, mapApis)

  let selectedOperation : any = null;
  if(selectedOperations.length === 1) {
    selectedOperation = selectedOperations[0]
  }

  return (
    <div className="react-map">
      <ReactMapGL
        {...viewport}
        onViewportChange={viewport => setViewport(viewport)}
        mapboxApiAccessToken={MAP_ACCESS_TOKEN}
        mapStyle={MAP_STYLE}
        dragRotate={false}
        ref={mapRef}
        onClick={handleClick}
        onHover={debounce(handleHover, 10)}
        doubleClickZoom={false}
      >
        {showSelected &&
          selectedOperation &&
          selectedOperation.latitude &&
          selectedOperation.longitude && (
            <Popup
              latitude={selectedOperation.latitude}
              longitude={selectedOperation.longitude}
              closeButton={false}
              closeOnClick={true}
              onClose={() => setShowSelected(false)}
              tipSize={0}
            >
              <OperationData selectedOperation={selectedOperation} />
            </Popup>
          )}
        {!showSelected &&
          hoveredOperation &&
          hoveredOperation.latitude &&
          hoveredOperation.longitude && (
            <Popup
              latitude={hoveredOperation.latitude}
              longitude={hoveredOperation.longitude}
              closeButton={false}
              closeOnClick={true}
              onClose={() => setHoveredOperation(null)}
              tipSize={0}
            >
              <OperationData selectedOperation={hoveredOperation} />
            </Popup>
          )}
      </ReactMapGL>
    </div>
  );
};
