import React, { useContext } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { convertDatetoBPBDate } from "../../../helpers/dateTimeHelpers";
import { buildCurrentOrder } from "../../../helpers/CartBuildingHelpers";

import { Button } from "primereact/button";

import swal from "@sweetalert/with-react";

import styled from "styled-components";

const OrderButtons = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 5px 0;
`;

const clonedeep = require("lodash.clonedeep");

function OrderEntryButtons() {
  const { route, ponote } = useContext(CurrentDataContext);
  const { setChosen, delivDate, chosen, currentCartList } = useContext(
    CurrentDataContext
  );
  const { orders, setOrders, recentOrders, setRecentOrders } = useContext(
    OrdersContext
  );
  const { standing } = useContext(StandingContext);
  const {
    orderTypeWhole,
    setOrderTypeWhole,
    modifications,
    setModifications,
    cartList,
    setCartList,
    standList,
    setRouteIsOn,
  } = useContext(ToggleContext);

  let type = orderTypeWhole ? "Retail" : "Wholesale";
  let cartStand = cartList ? "Standing" : "Cart";

  const handleChangeorderTypeWhole = () => {
    document.getElementById("orderCommand").focus();
    setOrderTypeWhole(!orderTypeWhole);
    setChosen("");
  };

  const handleCartStandToggle = () => {
    document.getElementById("orderCommand").focus();
    let realCartList = clonedeep(cartList);
    realCartList ? setRouteIsOn(false) : setRouteIsOn(true);
    setCartList(!cartList);
  };

  const handleClear = () => {
   
  };

  const handleAddUpdate = () => {
    
  };

  return (
    <OrderButtons>
      <Button
        label="Add/Update"
        icon="pi pi-plus"
        disabled={chosen === "  "}
        onClick={handleAddUpdate}
        className={
          modifications
            ? "p-button-raised p-button-rounded p-button-danger"
            : "p-button-raised p-button-rounded p-button-success"
        }
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
  );
}

export default OrderEntryButtons;
