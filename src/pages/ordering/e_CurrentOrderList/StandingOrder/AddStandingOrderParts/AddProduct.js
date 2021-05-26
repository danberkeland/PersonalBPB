import React, { useContext } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

import { Button } from "primereact/button";

const clonedeep = require("lodash.clonedeep");

const AddProduct = ({ database, pickedProduct, setPickedProduct }) => {
 
  const { chosen, standArray, setStandArray } =
    useContext(CurrentDataContext);
  const { standList, setModifications } = useContext(ToggleContext);
  
  const handleAdd = () => {
    let newList = clonedeep(standArray);

    if (pickedProduct !== "" && pickedProduct) {
      let newOrder = {
        prodName: pickedProduct,
        custName: chosen,
        isStand: standList ? true : false,
        Sun: 0,
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
      };
      newList.push(newOrder);
    }
    setStandArray(newList);
    setModifications(true)

    setPickedProduct("");
  };

  return (
    <Button
      label="ADD"
      disabled={chosen === "  " || pickedProduct === ""}
      icon="pi pi-plus"
      onClick={handleAdd}
    />
  );
};

export default AddProduct;
