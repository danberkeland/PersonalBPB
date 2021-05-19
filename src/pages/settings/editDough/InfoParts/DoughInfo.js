import React from "react";

import "primeflex/primeflex.css";

import { InputText } from "primereact/inputtext";

import { setValue, fixValue } from "../../../../helpers/formHelpers";

const DoughInfo = ({ selectedDough, setSelectedDough, setIsModified }) => {
  const InputStyle = {
    width: "50px",
    backgroundColor: "#E3F2FD",
    fontWeight: "bold",
  };

  const onEnter = (e) => {
    if (e.code === "Enter") {
      setSelectedDough(setValue(e, selectedDough));
      setIsModified(true);
    }
  };

  const onExit = (e) => {
    setSelectedDough(fixValue(e, selectedDough));
    setIsModified(true);
  };

  const InfoInput = ({ id }) => {
    return (
      <InputText
        id={id}
        style={InputStyle}
        placeholder={selectedDough[id]}
        onKeyUp={onEnter}
        onBlur={onExit}
      />
    );
  };

  return (
    <React.Fragment>
      <div className="p-grid p-ai-center">
      <div className="p-grid p-ai-center">
        <div className="p-col">
          <div>Dough Name: {selectedDough.doughName}</div>
        </div>
        <div className="p-col">
          <label htmlFor="mixedWhere">Where:</label>
          <InfoInput id="mixedWhere" />
        </div>
        <div className="p-col">
          <label htmlFor="isBakeReady">Bake Same Day as Mix?</label>
          <InfoInput id="isBakeReady" />
        </div>
      </div>
      <div className="p-grid p-ai-center">
        <div className="p-col">
          <label htmlFor="hydration">Hydration</label>
          <InfoInput id="hydration" />%
        </div>
        <div className="p-col">
          <label htmlFor="batchSize">Default Bulk:</label>
          <InfoInput id="batchSize" />
          lb.
        </div>
        <div className="p-col">
          <label htmlFor="buffer">Buffer:</label>
          <InfoInput id="buffer" />
          lb.
        </div>
      </div>
      
      </div>
    </React.Fragment>
  );
};

export default DoughInfo;
