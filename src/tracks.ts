import { whenMapHasLoadedStyle, whenMapHasLoadedSource } from "./maps";


export const loadTracks =(mapApis: any) => {
  whenMapHasLoadedStyle(mapApis).then(() => {
    // add mapbox tile
    // @ts-ignore
    mapApis.addSource("track_20190524", {
      type: "vector",
      url: "mapbox://ems-webapps.panynj_20190524"
    });
    whenMapHasLoadedSource(mapApis, "track_20190524").then(() =>{
      // @ts-ignore
      mapApis.addLayer({
        id: "tracks",
        type: "line",
        source: `track_20190524`,
        "source-layer": `tracks_20190524`,
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "operationType"], "Departure"],
            "#8c54ff",
            ["==", ["get", "operationType"], "Arrival"],
            "#ea702e",
            ["==", ["get", "operationType"], "Overflight"],
            "#5aa700",
            ["==", ["get", "operationType"], "TouchAndGo"],
            "#5aaafa",
            "hsl(0, 100%, 100%)"
          ],
          "line-opacity": 0.4,
          "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.5, 12, 5]
        }
      });
    });
  })
}