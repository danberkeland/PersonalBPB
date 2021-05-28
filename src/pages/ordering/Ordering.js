import React, { useState, useEffect, useContext } from "react";

import Calendar from "./Parts/Calendar";
import CurrentOrderInfo from "./Parts/CurrentOrderInfo";
import CurrentOrderList from "./Parts/CurrentOrderList";
import OrderCommandLine from "./Parts/OrderCommandLine";
import OrderEntryButtons from "./Parts/OrderEntryButtons";
import { createOrder } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import { promisedData } from "../../helpers/databaseFetchers";

import styled from "styled-components";
import { ToggleContext } from "../../dataContexts/ToggleContext";


const clonedeep = require("lodash.clonedeep");

const MainWindow = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
`;

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  border: 1px solid lightgray;
  padding: 10px 10px;
  margin: 0px 10px;
  box-sizing: border-box;
`;


function Ordering() {
  const [database, setDatabase] = useState([]);
  const { reload, setIsLoading, setModifications } = useContext(ToggleContext);

  const loadDatabase = async (database) => {
    const [products, customers, routes, standing, orders] = database;
    let ordsToUpdate = clonedeep(orders)
    setDatabase(database)
    let ord = await fetchSq(database);
   console.log("ord",ord)
    for (let newOrd of ord) {
      
      let qty = Number(newOrd["qty"]);
      let dt = new Date().toISOString();
      let delivDate = newOrd["delivDate"].split("T")[0];
      delivDate = delivDate.split("-");
      delivDate = delivDate[1] + "/" + delivDate[2] + "/" + delivDate[0];

      let locIDBPBN = "16VS30T9E7CM9";
      console.log(newOrd.location)
      console.log(locIDBPBN)
      let rt="slopick";
      let custName = newOrd["custName"];

      let prodName =
        products[
          products.findIndex((prod) => newOrd["item"].includes(prod.squareID))
        ]["prodName"];
     
      if (newOrd.location === locIDBPBN) {
        rt = "atownpick";
      } 

      let itemToAdd = {
        SO: qty,
        qty: qty,
        timeStamp: dt,
        isWhole: false,
        PONote: "paid",
        delivDate: delivDate,
        custName: custName,
        prodName: prodName,
        route: rt,
      };
     
      // Search orders for object, if doesn't exist, add:
      let ind = orders.findIndex(
        (ord) => ord["custName"] === custName && ord["prodName"] === prodName
      );

      if (ind === -1) {
        try {
          await API.graphql(
            graphqlOperation(createOrder, { input: { ...itemToAdd } })
          );
          ordsToUpdate.push(itemToAdd);
        } catch (error) {
          console.log("error on creating Orders", error);
        }
      }
    }
    let DBToMod = clonedeep(database);
    DBToMod[4] = ordsToUpdate;
    setDatabase(DBToMod);
  }

  const fetchSq = async () => {
    try {
      let response = await fetch(
        "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"
      );

      let newOrders = await response.json();
      newOrders = JSON.parse(newOrders);
      return newOrders
    } catch {
      console.log("Error on Square load")
    }

  };


  useEffect(() => {
    promisedData(setIsLoading).then((database) => loadDatabase(database));
  }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps



  return (
    <MainWindow>
      <BasicContainer>
        <Calendar database={database} />
      </BasicContainer>
      <BasicContainer>
        <OrderCommandLine database={database} setDatabase={setDatabase} />
        <CurrentOrderInfo database={database} setDatabase={setDatabase} />
        <CurrentOrderList database={database} setDatabase={setDatabase} />
        <OrderEntryButtons database={database} setDatabase={setDatabase} />
      </BasicContainer>
    </MainWindow>
  );
}

export default Ordering;
