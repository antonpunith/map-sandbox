import { useEffect, useReducer } from "react";
import { whenMapHasLoadedStyle, whenMapHasLoadedSource } from "./maps";
import {
  mapboxStyleBackgroundNormalPaint,
  mapboxStyleTaggedPaint,
  mapboxStyleHoverPaint
} from "./styles";

import { DATES, SOURCE_PREFIX, LAYER_PREFIX } from "./constants";

export const loadTracks = (mapApis: any) => {
  whenMapHasLoadedStyle(mapApis).then(() => {
    DATES.forEach(date => {
      mapApis.addSource(`${SOURCE_PREFIX}${date}`, {
        type: "vector",
        url: `mapbox://ems-webapps.panynj_${date}`
      });
    });

    Promise.all(
      DATES.map(date =>
        whenMapHasLoadedSource(mapApis, `${SOURCE_PREFIX}${date}`)
      )
    ).then(() => {
      DATES.forEach(date => {
        // @ts-ignore
        mapApis.addLayer({
          id: `operations_${date}`,
          type: "line",
          source: `${SOURCE_PREFIX}${date}`,
          "source-layer": `${LAYER_PREFIX}${date}`,
          paint: mapboxStyleBackgroundNormalPaint
        });

        mapApis.addLayer({
          id: `hovered_${date}`,
          type: "line",
          source: `${SOURCE_PREFIX}${date}`,
          "source-layer": `${LAYER_PREFIX}${date}`,
          paint: mapboxStyleHoverPaint
        });

        mapApis.addLayer({
          id: `tagged_${date}`,
          type: "line",
          source: `${SOURCE_PREFIX}${date}`,
          "source-layer": `${LAYER_PREFIX}${date}`,
          paint: mapboxStyleTaggedPaint
        });
      });
    });
  });
};

export const useMapTagSelection = (selectedOperation: any, mapApis: any) => {
  const tagsReducer = (state: any, action: any) => {
    if (state) {
      mapApis.removeFeatureState(
        {
          id: state.id,
          source: state.layer.source,
          sourceLayer: state.layer["source-layer"]
        },
        "tagged"
      );
    }
    switch (action.type) {
      case "set-tag":
        mapApis.setFeatureState(
          {
            id: selectedOperation.id,
            source: selectedOperation.layer.source,
            sourceLayer: selectedOperation.layer["source-layer"]
          },
          { tagged: true }
        );
        return action.data.operation;
      default:
        return null;
    }
  };

  const [operationTagged, dispatchTagged] = useReducer(tagsReducer, null);

  useEffect(() => {
    if (mapApis) {
      if (selectedOperation && selectedOperation.properties) {
        dispatchTagged({
          type: "set-tag",
          data: { operation: selectedOperation }
        });
      } else {
        dispatchTagged({ type: "unset-tag" });
      }
    }
  }, [selectedOperation, mapApis]);

  return operationTagged;
};

export const useMapHover = (hoveredTrack: any, mapApis: any) => {
  const hoverReducer = (state: any, action: any) => {
    if (mapApis) {
      if (state) {
        mapApis.removeFeatureState(
          {
            id: state.id,
            source: state.layer.source,
            sourceLayer: state.layer["source-layer"]
          },
          "hovered"
        );
      }
      switch (action.type) {
        case "set-hover":
          if (action.data) {
            const feature = action.data;
            mapApis.setFeatureState(
              {
                id: feature.id,
                source: feature.layer.source,
                sourceLayer: feature.layer["source-layer"]
              },
              { hovered: true }
            );
            return feature;
          }
          return null;
        default:
          return null;
      }
    }
  };

  const [tracksHovered, dispatchHover] = useReducer(hoverReducer, null);
  useEffect(() => {
    // TODO dispatch hover change
    dispatchHover({ type: "set-hover", data: hoveredTrack });
  }, [hoveredTrack]);
  return { tracksHovered };
};


export const useMapMultiSelect = (mapNode: any, mapApis: any) => {
  useEffect(() => {

    let startPoint: any = null;
    let endPoint: any = null;

    if (mapApis && mapNode && mapNode._eventCanvasRef && mapNode._eventCanvasRef.current) {
      const mapDiv = mapNode._eventCanvasRef.current;

      const selectFeatures = (start: { x: number, y: number }, end: { x: number, y: number }) => {
        if (mapApis && start && end) {
          // @ts-ignore
          const features = mapApis.queryRenderedFeatures(
            [
              [Math.min(start.x, end.x), Math.min(start.y, end.y)],
              [Math.max(start.x, end.x), Math.max(start.y, end.y)]
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
            features.forEach((feature: any) => {
              // @ts-ignore
              mapApis.setFeatureState(
                {
                  id: feature.id,
                  source: feature.layer.source,
                  sourceLayer: feature.layer["source-layer"]
                },
                { tagged: true }
              );
            })
          }
        }
      }

      const finishSelect = (startPoint: any, endPoint: any) => {
        if (startPoint && endPoint) {
          selectFeatures(startPoint, endPoint);
        }

        startPoint = null; endPoint = null;
        mapDiv.removeEventListener('mouseup', onMouseUp)
      }

      const onMouseUp = (e: any) => {
        endPoint = { x: e.clientX, y: e.clientY };
        finishSelect(startPoint, endPoint)
      }
      const onMouseDown = (e: any) => {
        if (e.shiftKey) {
          startPoint = { x: e.clientX, y: e.clientY };
          // TODO add event listeners 
          mapDiv.addEventListener('mouseup', onMouseUp)
        }
      }
      mapDiv.addEventListener('mousedown', onMouseDown);
    }
  }, [mapNode, mapApis])
}
