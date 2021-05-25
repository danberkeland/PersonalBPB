import React, { useContext, useEffect } from "react";

import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

import { Button } from "primereact/button";


const StandOrHold = ({ standHold, setStandHold }) => {
  const { standList, setStandList } = useContext(ToggleContext);

  useEffect(() => {
    standList ? setStandHold("MAKE H.O.") : setStandHold("MAKE S.O.");
  }, [standList]);

  const handleStandHold = () => {
    let newStand = !standList;

    setStandList(newStand);
  };

  return (
    <Button
      className={
        !standList
          ? "p-button-raised p-button-rounded p-button-danger"
          : "p-button-raised p-button-rounded p-button-success"
      }
      onClick={handleStandHold}
      label={standHold}
    />
  );
};

export default StandOrHold;
