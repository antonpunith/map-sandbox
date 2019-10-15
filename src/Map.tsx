import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Popup } from "react-map-gl";

// map functions
import { useMapRef, useMapApis } from "./maps";
// tracks
import { loadTracks, useMapTagSelection, useMapHover } from "./tracks";
// constants
import { MAP_ACCESS_TOKEN, MAP_STYLE, DATES} from "./constants";
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
  const [hoveredOperations, setHoveredOperations]: any = useState([]);

  const handleClick = (e: any) => {
    const eventTime = new Date()
    console.log('map click',eventTime.getMilliseconds());

      if (mapApis) {
        for (let distance = 0; distance <= 10; distance++) {
          // @ts-ignore
          const features = mapApis.queryRenderedFeatures(
            [
              [e.point[0] - distance, e.point[1] - distance],
              [e.point[0] + distance, e.point[1] + distance]
            ],
            { layers: DATES.map(date => `operations_${date}`), filter:['any',['==', ['get', 'operationType'], 'Departure'], ['==', ['get', 'operationType'], 'Arrival']] }
          );
          const queriedTime = new Date()
          console.log(distance, queriedTime.getMilliseconds());
          if (features.length && features[0].id) {
            const feature = features[0];
            feature.latitude = e.lngLat[1];
            feature.longitude = e.lngLat[0];
            setSelectedOperation(feature);
            break;
          }
        }
      }
  };
  const handleHover = (e: any) => {
    if (viewport.zoom > 11 && mapApis) {
      for (let distance = 0; distance <= 5; distance++) {
        // @ts-ignore
        const features = mapApis.queryRenderedFeatures(
          [
            [e.point[0] - distance, e.point[1] - distance],
            [e.point[0] + distance, e.point[1] + distance]
          ],
          { layers: DATES.map(date => `operations_${date}`), filter:['any',['==', ['get', 'operationType'], 'Departure'], ['==', ['get', 'operationType'], 'Arrival']] }
        );
        setHoveredOperations(features);
      }
    }
    else {
      if(hoveredOperations.length){
        setHoveredOperations([]);
      }
    }
  }

  useMapTagSelection(selectedOperation, mapApis);

  useMapHover(hoveredOperations, mapApis);

  return (
    <div className="react-map" onClick={() => { const time = new Date(); console.log('clicked', time.getMilliseconds())}}>
      <ReactMapGL
        {...viewport}
        onViewportChange={viewport => setViewport(viewport)}
        mapboxApiAccessToken={MAP_ACCESS_TOKEN}
        mapStyle={MAP_STYLE}
        ref={mapRef}
        onClick={handleClick}
        onHover={handleHover}
        doubleClickZoom={false}
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



      // const distance = 5;
      // // @ts-ignore
      // var features = mapApis.queryRenderedFeatures(
      //   [
      //     [e.point[0] - distance, e.point[1] - distance],
      //     [e.point[0] + distance, e.point[1] + distance]
      //   ],
      //   { layers: DATES.map(date => `operations_${date}`), filter:['any',['==', ['get', 'operationType'], 'Departure'], ['==', ['get', 'operationType'], 'Arrival']] }
      // );
      // setHoveredOperations(features);