
import React, { useContext, useEffect } from "react";

import { Button } from "primereact/button";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { OrdersContext } from "../../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../../dataContexts/StandingContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { v4 as uuidv4 } from 'uuid';

import styled from "styled-components";

import { buildCurrentOrder } from "../../../../helpers/CartBuildingHelpers";

const clonedeep = require("lodash.clonedeep");

const OrderGrid = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  border: none;
  display: grid;
  align-items: center;
  grid-template-columns: 0.5fr 3fr 0.5fr 0.5fr;
  row-gap: 4px;
  flex-shrink: 1;
`;
const TrashCan = styled.div`
  background-color: transparent;
  border: none;
`;

const InputBox = styled.div`
  width: 50%;
`;

const Previous = styled.div`
  font-weight: bold;
  color: red;
`;

const BuildCurrentCartList = () => {
  const { orders } = useContext(OrdersContext);
  const { standing } = useContext(StandingContext);
  const {
    chosen,
    delivDate,
    currentCartList,
    setCurrentCartList,
    ponote,
    route,
  } = useContext(CurrentDataContext);
  const { setModifications } = useContext(ToggleContext);

  useEffect(() => {
    if (chosen !== "  ") {
      let currentOrderList = buildCurrentOrder(
        chosen,
        delivDate,
        orders,
        standing,
        route,
        ponote
      );
      currentOrderList = currentOrderList.filter((order) => order["qty"] !== 0);
        
      setCurrentCartList(currentOrderList);
    }
  }, [chosen, delivDate, orders, standing, route, ponote]);

  const handleQtyModify = (prodName, qty) => {
    let cartToMod = clonedeep(currentCartList);
    let ind = cartToMod.findIndex((cur) => cur["prodName"] === prodName);
    cartToMod[ind]["qty"] = qty;

    setCurrentCartList(cartToMod);
    setModifications(true);
  };

  return (
    <React.Fragment>
      <OrderGrid>
        <label></label>
        <label>PRODUCT</label>
        <label>QTY</label>
        <label>PREV</label>
        {currentCartList.map((order) => (
          <React.Fragment key={uuidv4() + "b"}>
            <TrashCan>
              <Button
                icon="pi pi-trash"
                className="p-button-outlined p-button-rounded p-button-help p-button-sm"
                value={0}
                onClick={(e) => {
                  handleQtyModify(order["prodName"], 0);
                }}
                key={uuidv4() + "e"}
                name={order["prodName"]}
                data-qty={order["qty"]}
                id={order["prodName"]}
              />
            </TrashCan>
            <label key={uuidv4()}>{order["prodName"]}</label>
            <InputBox>
              <input
                type="text"
                size="3"
                maxLength="4"
                key={uuidv4() + "c"}
                id={order["prodName"] + "item"}
                name={order["prodName"]}
                data-qty={order["qty"]}
                placeholder={order["qty"]}
                onKeyUp={(e) => {
                  handleQtyModify(order["prodName"], Number(e.target.value));
                }}
                onBlur={(e) => {
                  e.target.value = null;
                }}
              ></input>
            </InputBox>
            <Previous>
              <label key={uuidv4() + "d"}>
                {order["SO"] === order["qty"] ? "" : order["SO"]}
              </label>
            </Previous>
          </React.Fragment>
        ))}
      </OrderGrid>
    </React.Fragment>
  );
};

export default BuildCurrentCartList;