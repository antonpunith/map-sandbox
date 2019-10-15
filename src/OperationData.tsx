import React from 'react';

export const OperationData = ({selectedOperation}: any) => {
  if(!selectedOperation) {
    return null
  }
  const time = new Date();
  return (
    <div>
    <strong>Flight</strong>: {selectedOperation.properties.acid} <br />
    <strong>Category</strong>: {selectedOperation.properties.aircraftCategory} <br />
    <strong>Runway</strong>: {selectedOperation.properties.runwayName} <br />
    <strong>Date</strong>: {selectedOperation.properties.operationDate} <br />
    <strong>Time</strong>: {selectedOperation.properties.operationTime} <br />
    <strong>Type</strong>: {selectedOperation.properties.operationType}<br/>
      {time.getMilliseconds()}
  </div>
  )
}