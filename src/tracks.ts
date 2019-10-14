import { useEffect, useReducer } from "react";
import { whenMapHasLoadedStyle, whenMapHasLoadedSource } from "./maps";
import {
  mapboxStyleBackgroundNormalPaint,
  mapboxStyleTaggedPaint
} from "./styles";

import { SOURCE_ID, SOURCE_LAYER } from "./constants";

export const loadTracks = (mapApis: any) => {
  whenMapHasLoadedStyle(mapApis).then(() => {
    // add mapbox tile
    // @ts-ignore
    mapApis.addSource(SOURCE_ID, {
      type: "vector",
      url: "mapbox://ems-webapps.panynj_20190524"
    });
    whenMapHasLoadedSource(mapApis, SOURCE_ID).then(() => {
      // @ts-ignore
      mapApis.addLayer({
        id: "tracks",
        type: "line",
        source: SOURCE_ID,
        "source-layer": SOURCE_LAYER,
        paint: mapboxStyleBackgroundNormalPaint
      });

      mapApis.addLayer({
        id: "tagged",
        type: "line",
        source: SOURCE_ID,
        "source-layer": SOURCE_LAYER,
        paint: mapboxStyleTaggedPaint
      });
    });
  });
};

export const useMapTagSelection = (selectedOperation: any, mapApis: any) => {
  const tagsReducer = (state: any, action: any) => {
    if (state) {
      mapApis.removeFeatureState({
        id: state.id,
        source: SOURCE_ID,
        sourceLayer: SOURCE_LAYER
      });
    }
    switch (action.type) {
      case "set-tag":
        mapApis.setFeatureState(
          {
            id: selectedOperation.id,
            source: SOURCE_ID,
            sourceLayer: SOURCE_LAYER
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
