export const mapboxStyleBackgroundNormalPaint = {
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
  "line-opacity": [
    "interpolate",
    ["linear"],
    ["zoom"],
    7,
    ["case", ["==", ["get", "operationType"], "Overflight"], 0, 0.2],
    10,
    ["case", ["==", ["get", "operationType"], "Overflight"], 0, 0.4],
    12,
    ["case", ["==", ["get", "operationType"], "Overflight"], 0, 0.6]
  ],
  "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.5, 11, 1, 14, 3]
};

export const mapboxStyleTaggedPaint = {
  "line-opacity": [
    "case",
    ["boolean", ["feature-state", "tagged"], false],
    1,
    0
  ],
  "line-width": ["case", ["boolean", ["feature-state", "tagged"], false], 2, 0],
  "line-color": [
    "case",
    ["boolean", ["feature-state", "tagged"], false],
    "#0b6cf4",
    "hsl(0, 100%, 100%)"
  ]
};

export const mapboxStyleHoverPaint = {
  "line-opacity": [
    "case",
    ["boolean", ["feature-state", "hovered"], false],
    1,
    0
  ],
  "line-width": [
    "case",
    ["boolean", ["feature-state", "hovered"], false],
    2,
    0
  ],
  "line-color": [
    "case",
    ["boolean", ["feature-state", "hovered"], false],
    "#bada55",
    "hsl(0, 100%, 100%)"
  ]
};
