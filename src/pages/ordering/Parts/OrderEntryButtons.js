import React, { useContext } from "react";

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

const clonedeep = require("lodash.clonedeep");

function OrderEntryButtons({ database, setDatabase, authType }) {

  const {
    setChosen,
    currentCartList,
    setCurrentCartList,
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
    setCurrentCartList(cartToMod);
 
  };

  

  return (
    <OrderButtons>
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
      {authType === "bpbadmin" ?
      <Button
        label={type}
        icon="pi pi-dollar"
        onClick={handleChangeorderTypeWhole}
        className="p-button-raised p-button-rounded p-button-secondary"
      /> : ''}
    </OrderButtons>
  );
}

export default OrderEntryButtons;
