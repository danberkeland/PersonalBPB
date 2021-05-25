import React, { useContext } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { convertDatetoBPBDate } from "../../../helpers/dateTimeHelpers";
import { buildCurrentOrder } from "../../../helpers/CartBuildingHelpers"

import {
  updateOrder,
  createOrder,
  createStanding,
  updateStanding,
} from "../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import { Button } from "primereact/button";

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
    setDelivDate,
    delivDate,
    chosen,
    currentCartList,
    setCurrentCartList,
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
    setIsLoading,
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
    let cartToMod = clonedeep(currentCartList);
    for (let ord of cartToMod) {
      ord["qty"] = 0;
    }
    setCurrentCartList(cartToMod);
    setModifications(true);
  };

  const handleAddUpdate = async () => {
    //setIsLoading(true);
    let ordToModify
    console.log(route)
    console.log("orders",orders)
    if (cartList) {
      
      for (let ord of currentCartList) {
        let rte=route

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
            const newUpdate = await API.graphql(
              graphqlOperation(updateOrder, { input: { ...updateDetails } })
            );
            updateDetails.id = newUpdate.data.updateOrder.id
            let ind = orders.findIndex(ord => ord.id = updateDetails.id)
            ordToModify = clonedeep(orders)
            ordToModify[ind].qty = updateDetails.qty
            ordToModify[ind].prodName = updateDetails.prodName
            ordToModify[ind].custName = updateDetails.custName
            ordToModify[ind].PONote = updateDetails.PONote
            ordToModify[ind].route = updateDetails.route
            ordToModify[ind].SO = updateDetails.SO
            ordToModify[ind].isWhole = updateDetails.isWhole
            ordToModify[ind].delivDate = updateDetails.delivDate
            ordToModify[ind].timeStamp = updateDetails.timeStamp
            setOrders(ordToModify)

            
            
          } catch (error) {
            console.log("error on updating Orders", error);
          }
        } else {
          try {
            const newCreate = await API.graphql(
              graphqlOperation(createOrder, { input: { ...updateDetails } })
            );
            updateDetails.id = newCreate.data.createOrder.id
            ordToModify = clonedeep(orders)
            ordToModify.push(updateDetails)
            setOrders(ordToModify)
            
          } catch (error) {
            console.log("error on creating Orders", error);
          }
        }
      }
    } else {
      for (let stand of standArray) {
        if (stand["id"]) {
          const updateDetails = {
            prodName: stand["prodName"],
            Mon: stand["Mon"],
            Tue: stand["Tue"],
            Wed: stand["Wed"],
            Thu: stand["Thu"],
            Fri: stand["Fri"],
            Sat: stand["Sat"],
            Sun: stand["Sun"],
            isStand: standList,
            timeStamp: new Date(),
            id: stand["id"],
            _version: stand["_version"],
          };
          try {
            await API.graphql(
              graphqlOperation(updateStanding, {
                input: { ...updateDetails },
              })
            );
          } catch (error) {
            console.log("error on creating Orders", error);
          }
        } else {
          const updateDetails = {
            custName: chosen,
            prodName: stand["prodName"],
            Mon: stand["Mon"],
            Tue: stand["Tue"],
            Wed: stand["Wed"],
            Thu: stand["Thu"],
            Fri: stand["Fri"],
            Sat: stand["Sat"],
            Sun: stand["Sun"],
            isStand: standList,
            timeStamp: new Date(),
          };
          try {
            await API.graphql(
              graphqlOperation(createStanding, {
                input: { ...updateDetails },
              })
            );
          } catch (error) {
            console.log("error on creating Orders", error);
          }
        }
      }
    }
    
    setModifications(false);
    setStandLoaded(false);
    setHoldLoaded(false);
    setOrdersLoaded(false);
    document.getElementById("orderCommand").focus();
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
