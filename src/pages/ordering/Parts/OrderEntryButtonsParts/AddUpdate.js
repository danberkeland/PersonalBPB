import React, { useContext } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";
import { getRate }from "../../../../helpers/billingGridHelpers"



import {
  updateOrder,
  createOrder,
  createStanding,
  updateStanding,
} from "../../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import { Button } from "primereact/button";

const clonedeep = require("lodash.clonedeep");

function AddUpdate({ database, setDatabase }) {
  const [products, customers, routes, standing, orders,d,dd, altPricing] = database;
  const { route, ponote } = useContext(CurrentDataContext);
  const {
    delivDate,
    chosen,
    currentCartList,
    standArray,
  } = useContext(CurrentDataContext);
  const {
      reload,
      setReload 
  } = useContext(ToggleContext)

  const {
    orderTypeWhole,
    modifications,
    setModifications,
    cartList,
    standList,
    setIsLoading,
  } = useContext(ToggleContext);

  const handleUpdateCart = async () => {
  
    for (let ord of currentCartList) {
      let rte = route;
      let price = getRate(products,ord, altPricing)

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
        updateDetails.id = ord["id"];
        updateDetails._version = ord["_version"];
        try {
          await API.graphql(
            graphqlOperation(updateOrder, { input: { ...updateDetails } })
          );
          console.log(updateDetails.prodName, "Successful update");
        } catch (error) {
          console.log(updateDetails.prodName, "Failed Update");
        }
      } else {
        try {
          await API.graphql(
            graphqlOperation(createOrder, { input: { ...updateDetails } })
          );
          console.log(updateDetails.prodName, "Successful create");
        } catch (error) {
          console.log(updateDetails.prodName, "Failed create");
        }
      }
    }
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
     setReload(!reload) 
  }
  
  const handleAddUpdate = async () => {
    setIsLoading(true);
    if (cartList) {
      handleUpdateCart()
    } else {
      handleUpdateStanding()
    }
    //setReload(!reload)
    setIsLoading(false);
   
    document.getElementById("orderCommand").focus();
  };

  return (
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
  );
}

export default AddUpdate;
