import React from 'react';

export const OperationData = ({selectedOperation}: any) => {
  if(!selectedOperation) {
    return null
  }
  return (
    <div>
    <strong>Flight</strong>: {selectedOperation.properties.acid} <br />
    <strong>Category</strong>: {selectedOperation.properties.aircraftCategory} <br />
    <strong>Runway</strong>: {selectedOperation.properties.runwayName} <br />
    <strong>Time</strong>: {selectedOperation.properties.operationTime} <br />
    <strong>Type</strong>: {selectedOperation.properties.operationType}
  </div>
  )
}