import React, { useContext } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import {
  convertDatetoBPBDate,
  convertDatetoStandingDate,
} from "../../../helpers/dateTimeHelpers";

import {
  updateOrder,
  deleteOrder,
  createOrder,
  createStanding,
  updateStanding
} from "../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

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
  const {
    setChosen,
    delivDate,
    chosen,
    currentCartList,
    standArray,
    setStandArray,
  } = useContext(CurrentDataContext);
  const {
    orders,
    setOrders,
    setOrdersLoaded,
    recentOrders,
    setRecentOrders,
  } = useContext(OrdersContext);
  const { standing, setStandLoaded } = useContext(StandingContext);
  const { holding, setHoldLoaded } = useContext(HoldingContext);
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

  const handleClear = () => {};

  const handleAddUpdate = async () => {
    if (cartList) {
      for (let ord of currentCartList) {
        let rte;
        switch (ord["route"]) {
          case "slopick":
            rte = "slopick";
            break;
          case "atownpick":
            rte = "atownpick";
            break;
          default:
            rte = "deliv";

            const updateDetails = {
              qty: ord["qty"],
              prodName: ord["prodName"],
              custName: chosen,
              PONote: ponote,
              route: rte,
              SO: ord["qty"],
              isWhole: orderTypeWhole,
              delivDate: convertDatetoBPBDate(delivDate),
              timeStamp: new Date(),
            };

            if (ord["id"]) {
              updateDetails.id = ord["id"];
              updateDetails._version = ord["_version"];

              try {
                await API.graphql(
                  graphqlOperation(updateOrder, { input: { ...updateDetails } })
                );
              } catch (error) {
                console.log("error on updating Orders", error);
              }
            } else {
              try {
                await API.graphql(
                  graphqlOperation(createOrder, { input: { ...updateDetails } })
                );
              } catch (error) {
                console.log("error on creating Orders", error);
              }
            }
        }
      }
    } else {
      for (let stand of standArray) {
        if (stand["id"]) {
         
          if (standList) {
            const updateDetails = {
              prodName: stand["prodName"],
              Mon: stand["Mon"],
              Tue: stand["Tue"],
              Wed: stand["Wed"],
              Thu: stand["Thu"],
              Fri: stand["Fri"],
              Sat: stand["Sat"],
              Sun: stand["Sun"],
              timeStamp: new Date(),
            };

            if (stand["id"]) {
              updateDetails.id = stand["id"];
              updateDetails._version = stand["_version"];
            }
            try {
              await API.graphql(
                graphqlOperation(updateStanding, { input: { ...updateDetails } })
              );
            } catch (error) {
            
              console.log("error on creating Orders", error);
            }
          } else {
            // update holding
          }
        } else {
          if (standList){
         
          try {
            await API.graphql(
              graphqlOperation(createStanding, { input: { ...stand } })
            );
          } catch (error) {
            console.log("error on creating Orders", error);
          }
          } else {
            // add to holding
          }
        }
      }
    }
    setStandLoaded(false)
    setHoldLoaded(false)
    setOrdersLoaded(false);
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
