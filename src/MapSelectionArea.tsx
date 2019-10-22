import React from 'react';


export const MapSelectionArea = ({selectionBounds}: any) => {
  if(!selectionBounds || !selectionBounds.startPoint || !selectionBounds.currentPoint) {
     return null;
  }
  const {startPoint, currentPoint } = selectionBounds;

  const minX = Math.min(startPoint.x, currentPoint.x);
  const minY = Math.min(startPoint.y, currentPoint.y);
  const maxX = Math.max(startPoint.x, currentPoint.x);
  const maxY = Math.max(startPoint.y, currentPoint.y);

  return (
  <div style={{
    background: 'rgba(255,0,0,0.2)',
    position: 'absolute',
    left: `${minX}px`,
    top: `${minY}px`,
    width: `${maxX - minX}px`,
    height: `${maxY - minY}px`,
  }} />
  );
}