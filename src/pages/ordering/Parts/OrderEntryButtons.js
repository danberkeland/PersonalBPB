import React, { useContext, useState, useEffect } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import AddUpdate from './OrderEntryButtonsParts/AddUpdate';

import { Button } from "primereact/button";

import styled from "styled-components";

const OrderButtons = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 5px 0;
`;

const OrderButtonsFloat = styled.div`
  display: flex;
  position: fixed;
  z-index: 100;
  top: 30px;
  justify-content: space-around;
  width: 100%;
  margin: 5px 0;
`;

const clonedeep = require("lodash.clonedeep");

function OrderEntryButtons() {

  const {
    setChosen,
    currentCartList,
    setCurrentCartList,
    database,
    setDatabase,
    authType
  } = useContext(CurrentDataContext);
  
  const {
    orderTypeWhole,
    setOrderTypeWhole,
    setModifications,
    cartList,
    setCartList,
    setRouteIsOn,
  } = useContext(ToggleContext);

  let type = orderTypeWhole ? "Retail" : "Wholesale";
  let cartStand = cartList ? "Standing" : "Cart";

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  

  const handleChangeorderTypeWhole = () => {
    try{
      document.getElementById("orderCommand").focus();
    } catch {
      console.log()
    }
    setOrderTypeWhole(!orderTypeWhole);
    setChosen("");
  };

  const handleCartStandToggle = () => {
    try{
      document.getElementById("orderCommand").focus();
    } catch {
      console.log()
    }
    let realCartList = clonedeep(cartList);
    realCartList ? setRouteIsOn(false) : setRouteIsOn(true);
    setCartList(!cartList);
  };

  const handleClear = () => {
    let cartToMod = clonedeep(currentCartList);
    for (let ord of cartToMod) {
      ord["qty"] = 0;
    }
    setModifications(true)
    setCurrentCartList(cartToMod);
 
  };

  const innards1 = <OrderButtons>
  <AddUpdate database={database} setDatabase={setDatabase}
  />
 
  <Button
    label="Clear"
    icon="pi pi-trash"
    disabled={!cartList}
    onClick={handleClear}
    className="p-button-raised p-button-rounded p-button-info"
  /> 

  <Button
    label={cartStand}
    icon="pi pi-shopping-cart"
    onClick={handleCartStandToggle}
    className="p-button-raised p-button-rounded p-button-secondary"
  />
 
  <Button
    label={type}
    icon="pi pi-dollar"
    onClick={handleChangeorderTypeWhole}
    className="p-button-raised p-button-rounded p-button-secondary"
  />
</OrderButtons>


const innards2 = <OrderButtonsFloat>
<AddUpdate database={database} setDatabase={setDatabase}
/></OrderButtonsFloat>


  

  return width > breakpoint ? innards1 : innards2 
    
  
}

export default OrderEntryButtons;
