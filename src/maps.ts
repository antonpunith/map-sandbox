import { useState, useCallback, useEffect } from "react";

export const useMapRef = () => {
  const [map, setMap] = useState(null);
  const mapRef = useCallback(map => {
    setMap(map);
  }, []);
  return [map, mapRef];
};

export const useMapApis = (map: any) => {
  const [mapApis, setMapApis] = useState(null);
  useEffect(() => {
    if (map) {
      // when map is ready
      setMapApis(map.getMap());
    }
  }, [map]);

  return mapApis;
};

export const whenMapHasLoadedStyle = (map: any) => {
  return new Promise(resolve => {
    const isStyleLoaded = () => {
      if (map.isStyleLoaded()) {
        return resolve();
      }
      setTimeout(isStyleLoaded, 50);
    };
    isStyleLoaded();
  });
};

export const checkSourceLoaded = (map: any, sourceString: string) => {
  if (
    !map ||
    !sourceString ||
    !map.getStyle() ||
    !map.getStyle().sources ||
    !Object.keys(map.getStyle().sources).includes(sourceString)
  ) {
    return false;
  }
  return map.isSourceLoaded(sourceString);
};

export const whenMapHasLoadedSource = (map: any, sourceString: string) => {
  return new Promise(resolve => {
    const checkSourceInMap = () => {
      if (checkSourceLoaded(map, sourceString)) {
        return resolve();
      }
      setTimeout(checkSourceInMap, 50);
    };
    checkSourceInMap();
  });
};
