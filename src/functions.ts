import { useState, useCallback, useEffect } from "react";

export const useMapRef = () => {
  const [map, setMap] = useState(null);
  const mapRef = useCallback(map => {
    setMap(map);
  }, []);
  return [map, mapRef];
};

export const useMapApis = map => {
  const [mapApis, setMapApis] = useState(null);
  useEffect(() => {
    if (map) {
      // when map is ready
      setMapApis(map.getMap());
    }
  }, [map]);

  return mapApis;
};

export const useGetMap = () => {
  const [mapNode, mapRef] = useMapRef();

  const mapApis = useMapApis(mapNode);
  return { mapRef, mapApis };
};
