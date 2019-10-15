import { useEffect, useReducer } from "react";
import { whenMapHasLoadedStyle, whenMapHasLoadedSource } from "./maps";
import {
  mapboxStyleBackgroundNormalPaint,
  mapboxStyleTaggedPaint
} from "./styles";

import { SOURCE_ID, SOURCE_LAYER, DATES, SOURCE_PREFIX, LAYER_PREFIX } from "./constants";

export const loadTracks = (mapApis: any) => {
  whenMapHasLoadedStyle(mapApis).then(() => {

    DATES.forEach(date => {
      mapApis.addSource(`${SOURCE_PREFIX}${date}`, {
        type: "vector",
        url: `mapbox://ems-webapps.panynj_${date}`
      });
    });

    Promise.all(DATES.map((date) => whenMapHasLoadedSource(mapApis, `${SOURCE_PREFIX}${date}`))).then(() => {

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
          id: `tagged_${date}`,
          type: "line",
          source: `${SOURCE_PREFIX}${date}`,
          "source-layer": `${LAYER_PREFIX}${date}`,
          paint: mapboxStyleTaggedPaint
        });
      })
    });
  });
};

export const useMapTagSelection = (selectedOperation: any, mapApis: any) => {
  const tagsReducer = (state: any, action: any) => {
    if (state) {
      mapApis.removeFeatureState({
        id: state.id,
        source: state.layer.source,
        sourceLayer: state.layer['source-layer']
      });
    }
    switch (action.type) {
      case "set-tag":
        mapApis.setFeatureState(
          {
            id: selectedOperation.id,
            source: selectedOperation.layer.source,
            sourceLayer: selectedOperation.layer['source-layer']
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
