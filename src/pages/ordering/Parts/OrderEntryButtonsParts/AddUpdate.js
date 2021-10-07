import React, { useContext, useRef } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";
import { getRate } from "../../../../helpers/billingGridHelpers";


import {
  updateOrder,
  createOrder,
  createStanding,
  updateStanding,
} from "../../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';


const clonedeep = require("lodash.clonedeep");
const axios = require('axios').default


function AddUpdate({ database, setDatabase }) {
  const [products, customers, routes, standing, orders, d, dd, altPricing] =
    database;
  const { route, ponote } = useContext(CurrentDataContext);
  const { delivDate, chosen, currentCartList, standArray } =
    useContext(CurrentDataContext);
  const { reload, setReload } = useContext(ToggleContext);

  const {
    orderTypeWhole,
    modifications,
    setModifications,
    cartList,
    standList,
    setIsLoading,
  } = useContext(ToggleContext);

  const toast = useRef(null);

  const showSuccess = (prod) => {
    toast.current.show({severity:'success', summary: 'Order Updated', detail:prod+' successfully entered', life: 3000});
}
  
  const callApi = async () => {
    try{
      axios.post('https://cuorbg4yv5.execute-api.us-east-2.amazonaws.com/done',
      {
        key1: chosen
      })
    }catch{

    }
  }
    

  const handleUpdateCart = async () => {
    for (let ord of currentCartList) {
      console.log("ord", ord);
      let rte = route;
      let price = getRate(products, ord, altPricing);

      const updateDetails = {
        qty: ord["qty"],
        prodName: ord["prodName"],
        custName: chosen,
        PONote: ponote,
        rate: price,
        route: rte,
        SO: ord["qty"],
        isWhole: orderTypeWhole,
        delivDate: convertDatetoBPBDate(delivDate),
        timeStamp: new Date(),
      };

      if (ord["id"]) {
        console.log("trying update");
        updateDetails.id = ord["id"];
        updateDetails._version = ord["_version"];
        try {
          await API.graphql(
            graphqlOperation(updateOrder, { input: { ...updateDetails } })
          );
          showSuccess(updateDetails.prodName)
          console.log(updateDetails.prodName, "Successful update");
        } catch (error) {
          console.log(updateDetails.prodName, "Failed Update");
        }
      } else {
        console.log("trying create");
        try {
          await API.graphql(
            graphqlOperation(createOrder, { input: { ...updateDetails } })
          );
          showSuccess(updateDetails.prodName)
          console.log(updateDetails.prodName, "Successful create");
        } catch (error) {
          console.log(updateDetails.prodName, "Failed create", error);
        }
      }
    }
    callApi()
    setModifications(false)
    setReload(!reload);
  };

  const handleUpdateStanding = async () => {
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
    setReload(!reload);
  };

  const handleAddUpdate = async () => {
    setIsLoading(true);
    if (cartList) {
      handleUpdateCart();
    } else {
      handleUpdateStanding();
    }
    //setReload(!reload)

    try {
      document.getElementById("orderCommand").focus();
    } catch {
      console.log();
    }
  };



  const innards = 
  <React.Fragment>
    <Toast ref={toast} />
    <Button
  label="Submit Order"
  icon="pi pi-plus"
  disabled={chosen === "  "}
  onClick={handleAddUpdate}
  className="p-button-raised p-button-rounded p-button-danger p-button-lg"
/>
  </React.Fragment>
  

  return modifications ? innards : ''
}

export default AddUpdate;
