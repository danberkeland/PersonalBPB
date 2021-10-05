import React, { useContext, useState, useEffect } from "react";

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
  const { orderTypeWhole, setModifications } = useContext(ToggleContext);

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  const handleAdd = () => {
    let qty = Number(document.getElementById("addedProdQty").value);
    let ind = products.findIndex(prod => prod.prodName === pickedProduct.prodName)
    let rate = products[ind].wholePrice
  
    let newOrder = {
      qty: qty,
      prodName: pickedProduct.prodName,
      custName: chosen,
      PONote: ponote,
      route: route,
      rate: rate,
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
    setModifications(true)
    document.getElementById("addedProdQty").value = null;
    setPickedProduct("");
  };

  return (
    <Button
      label={width > breakpoint ? "ADD" : ''}
      disabled={chosen === "  " || pickedProduct === ""}
      icon="pi pi-plus"
      className = {width > breakpoint ? '' : 'p-button-rounded p-button-lg'}
      onClick={() => handleAdd()}
    />
  );
};

export default AddProduct;
