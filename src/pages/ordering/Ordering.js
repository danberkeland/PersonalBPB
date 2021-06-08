import React, { useState, useEffect, useContext } from "react";

import Calendar from "./Parts/Calendar";
import CurrentOrderInfo from "./Parts/CurrentOrderInfo";
import CurrentOrderList from "./Parts/CurrentOrderList";
import OrderCommandLine from "./Parts/OrderCommandLine";
import OrderEntryButtons from "./Parts/OrderEntryButtons";
import { createOrder, updateProduct } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";
import { todayPlus } from "../../helpers/dateTimeHelpers";

import { promisedData } from "../../helpers/databaseFetchers";

import styled from "styled-components";
import { ToggleContext } from "../../dataContexts/ToggleContext";

const clonedeep = require("lodash.clonedeep");

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];

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
  const { reload, setIsLoading, setModifications, ordersHasBeenChanged, setOrdersHasBeenChanged } = useContext(ToggleContext);

  const loadDatabase = async (database) => {
    setIsLoading(true)
    const [products, customers, routes, standing, orders] = database;

    if(ordersHasBeenChanged){
    let prodsToUpdate = clonedeep(products)
    for (let prod of prodsToUpdate){
      if (prod.updatePreDate !== tomorrow){
        prod.updatePreDate = today
      }
      if (prod.updatePreDate === today){
        prod.preshaped = prod.prepreshaped
        prod.updatePreDate = tomorrow

      }
    }

    let DBToMod = clonedeep(database);
    DBToMod[0] = prodsToUpdate;
    setDatabase(DBToMod);

    for (let prod of prodsToUpdate){
      
      let prodToUpdate = {
        id: prod.id,
        preshaped: prod.preshaped,
        prepreshaped: prod.prepreshaped,
        updatePreDate: prod.updatePreDate      
      };
      try {
        await API.graphql(
          graphqlOperation(updateProduct, { input: { ...prodToUpdate } })
        );

      } catch (error) {
        console.log("error on creating Orders", error);
        setIsLoading(false)
      }
    }
    

    
    let ordsToUpdate = clonedeep(orders);
    setDatabase(database);
    let ord = await fetchSq(database);
    if (ord){
    console.log("ord", ord);
    for (let newOrd of ord) {
      let qty = Number(newOrd["qty"]);
      let dt = new Date().toISOString();
      let delivDate = newOrd["delivDate"].split("T")[0];
      delivDate = delivDate.split("-");
      delivDate = delivDate[1] + "/" + delivDate[2] + "/" + delivDate[0];

      let locIDBPBN = "16VS30T9E7CM9";
      console.log(newOrd.location);
      console.log(locIDBPBN);
      let rt = "slopick";
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
          setIsLoading(false)
        }
      }
    }
    let DBToMod = clonedeep(database);
    DBToMod[4] = ordsToUpdate;
    setDatabase(DBToMod);
  } else {
    console.log("Square orders did not load")
  }} 
  setDatabase(database);
  setIsLoading(false)
  setOrdersHasBeenChanged(false)
  };

  const fetchSq = async () => {
    try {
      let response = await fetch(
        "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"
      );

      let newOrders = await response.json();
      newOrders = JSON.parse(newOrders);
      return newOrders;
    } catch {
      console.log("Error on Square load");
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
