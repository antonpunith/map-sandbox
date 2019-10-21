import React from "react";

export const OperationData = ({ selectedOperation }: any) => {
  if (!selectedOperation) {
    return null;
  }
  const arrow =
    selectedOperation.properties.operationType === "Arrival" ? "<-" : "->";
  return (
    <div className="ops-popup">
      <h3 className="ops-popup_title">
        <strong>{selectedOperation.properties.acid} </strong>
      </h3>
      <p className="ops-popup_time">
        {selectedOperation.properties.operationDate}
      </p>
      <p>
        <span className="ops-popup_value">
          {selectedOperation.properties.airportId}{" "}
        </span>
        {arrow}
        <span className="ops-popup_value">
          {" "}
          {selectedOperation.properties.remoteAirportId}
        </span>
      </p>
      <p>
        <span className="ops-popup_label">Rwy:</span>
        <span className="ops-popup_value">
          {selectedOperation.properties.runwayName}
        </span>
      </p>
      <p>
        <span className="ops-popup_label">Model:</span>
        <span className="ops-popup_value">
          {selectedOperation.properties.aircraftType}
        </span>
      </p>
    </div>
  );
};
