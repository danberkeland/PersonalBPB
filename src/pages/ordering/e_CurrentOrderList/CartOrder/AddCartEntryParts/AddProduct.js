import React, { useContext } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

import { convertDatetoBPBDate } from "../../../../../helpers/dateTimeHelpers";
import { decideWhetherToAddOrModify } from "../../../../../helpers/sortDataHelpers";

import { Button } from "primereact/button";

const clonedeep = require("lodash.clonedeep");

const AddProduct = ({ database, setDatabase, pickedProduct, setPickedProduct }) => {
  const [products, customers, routes, standing, orders] = database;
  const {
    chosen,
    delivDate,
    route,
    ponote,
    currentCartList,
    setCurrentCartList,
  } = useContext(CurrentDataContext);
  const { orderTypeWhole } = useContext(ToggleContext);

  const handleAdd = () => {
    let qty = Number(document.getElementById("addedProdQty").value);

    let newOrder = {
      qty: qty,
      prodName: pickedProduct.prodName,
      custName: chosen,
      PONote: ponote,
      route: route,
      SO: 0,
      isWhole: orderTypeWhole,
      delivDate: convertDatetoBPBDate(delivDate),
    };
    let newOrderList = decideWhetherToAddOrModify(
      orders,
      newOrder,
      delivDate
    );
    
    let DBToUpdate = clonedeep(database)
    DBToUpdate[4] = newOrderList
    setDatabase(DBToUpdate)
    document.getElementById("addedProdQty").value = null;
    setPickedProduct("");
  };

  return (
    <Button
      label="ADD"
      disabled={chosen === "  " || pickedProduct === ""}
      icon="pi pi-plus"
      onClick={() => handleAdd()}
    />
  );
};

export default AddProduct;
