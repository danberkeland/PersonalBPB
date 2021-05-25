import React, { useContext } from "react";

import { Button } from "primereact/button";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

import { v4 as uuidv4 } from "uuid";

const clonedeep = require("lodash.clonedeep");

const TrashCan = ({ order }) => {
  const { currentCartList, setCurrentCartList } =
    useContext(CurrentDataContext);
  const { setModifications } = useContext(ToggleContext);

  const handleTrash = (prodName) => {
    let cartToMod = clonedeep(currentCartList);
    let ind = cartToMod.findIndex((cur) => cur["prodName"] === prodName);
    cartToMod[ind]["qty"] = 0;

    setCurrentCartList(cartToMod);
    setModifications(true);
  };

  return (
    <Button
      icon="pi pi-trash"
      className="p-button-outlined p-button-rounded p-button-help p-button-sm"
      value={0}
      onClick={(e) => {
        handleTrash(order["prodName"]);
      }}
      key={uuidv4() + "e"}
      name={order["prodName"]}
      data-qty={order["qty"]}
      id={order["prodName"]}
    />
  );
};

export default TrashCan;
