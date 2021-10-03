import React, { useState, useEffect, useContext } from "react";

import Calendar from "./Parts/Calendar";
import CurrentOrderInfo from "./Parts/CurrentOrderInfo";
import CurrentOrderList from "./Parts/CurrentOrderList";
import OrderCommandLine from "./Parts/OrderCommandLine";
import OrderEntryButtons from "./Parts/OrderEntryButtons";
import CustomerGroup from "./Parts/CurrentOrderInfoParts/CustomerGroup";
import {
  createOrder,
  updateDough,
  updateProduct,
  deleteOrder,
} from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";
import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";

import { promisedData } from "../../helpers/databaseFetchers";

import styled from "styled-components";
import { ToggleContext } from "../../dataContexts/ToggleContext";
import { CurrentDataContext } from "../../dataContexts/CurrentDataContext";

const clonedeep = require("lodash.clonedeep");

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];
let yesterday = todayPlus()[4];
let weekAgo = todayPlus()[5];

const MainWindow = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
`;

const MainWindowPhone = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr;
`;

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  border: 1px solid lightgray;
  padding: 10px 10px;
  margin: 5px 10px;
  box-sizing: border-box;
`;

const inlineContainer = styled.div`
display: inline;

`

const Title = styled.h2`
  padding: 0;
  margin: 5px 10px;
  color: rgb(66, 97, 201);
`;

const DateStyle = styled.div`
  padding: 0;
  color: grey;
  margin: 5px 10px;
`;

function Ordering({ authType }) {
  const [database, setDatabase] = useState([]);
  const [products, customers, routes, standing, orders] = database;

  const [customerGroup, setCustomerGroup] = useState(customers);
  const {
    reload,
    setIsLoading,
    setModifications,
    ordersHasBeenChanged,
    setOrdersHasBeenChanged,
  } = useContext(ToggleContext);

  const { chosen } = useContext(CurrentDataContext);

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  const loadDatabase = async (database) => {
    setIsLoading(true);
    const [products, customers, routes, standing, orders, doughs, altPricing] =
      database;
    console.log("Checking if Orders Have been changed");
    if (ordersHasBeenChanged) {
      let prodsToUpdate = clonedeep(products);
      let doughsToUpdate = clonedeep(doughs);
      let ordersToUpdate = clonedeep(orders);

      console.log("Yes they have! deleting old orders");
      let newYest = convertDatetoBPBDate(yesterday);
      let newWeekAgo = convertDatetoBPBDate(weekAgo);

      for (let ord of ordersToUpdate) {
        let ind = customers.findIndex((cust) => cust.custName === ord.custName);
        let weeklyCheck = "daily";

        if (ind > -1) {
          weeklyCheck = customers[ind].invoicing;
        }
        if (
          (ord.delivDate === newYest && weeklyCheck === "daily") ||
          (ord.delivDate === newWeekAgo && weeklyCheck === "weekly")
        ) {
          let ordToUpdate = {
            id: ord.id,
          };
          try {
            await API.graphql(
              graphqlOperation(deleteOrder, { input: { ...ordToUpdate } })
            );
          } catch (error) {
            console.log("error on deleting Order", error);
            setIsLoading(false);
          }
        }
      }

      console.log("Yes they have!  Updating preshaped numbers");
      for (let prod of prodsToUpdate) {
        if (prod.updatePreDate !== tomorrow) {
          prod.updatePreDate = today;
        }
        if (prod.updatePreDate === today) {
          prod.preshaped = prod.prepreshaped;
          prod.updatePreDate = tomorrow;
          let prodToUpdate = {
            id: prod.id,
            preshaped: prod.preshaped,
            prepreshaped: prod.prepreshaped,
            updatePreDate: prod.updatePreDate,
          };
          try {
            await API.graphql(
              graphqlOperation(updateProduct, { input: { ...prodToUpdate } })
            );
          } catch (error) {
            console.log("error on creating Orders", error);
            setIsLoading(false);
          }
        }
      }
      console.log("Yes they have!  Updating prepped bucket numbers");

      for (let dgh of doughsToUpdate) {
        if (dgh.updatePreBucket !== tomorrow) {
          dgh.updatePreBucket = today;
        }
        if (dgh.updatePreBucket === today) {
          dgh.bucketSets = dgh.preBucketSets;
          dgh.updatePreBucket = tomorrow;
          let doughToUpdate = {
            id: dgh.id,
            bucketSets: dgh.bucketSets,
            preBucketSets: dgh.preBucketSets,
            updatePreBucket: dgh.updatePreBucket,
          };
          try {
            await API.graphql(
              graphqlOperation(updateDough, { input: { ...doughToUpdate } })
            );
          } catch (error) {
            console.log("error on creating Orders", error);
            setIsLoading(false);
          }
        }
      }

      console.log("Yes they have!  Loading new Square Orders in DB");
      let ordsToUpdate = clonedeep(orders);
      setDatabase(database);
      let ord = await fetchSq(database);
      if (ord) {
        for (let newOrd of ord) {
          let qty = Number(newOrd["qty"]);
          let dt = new Date().toISOString();
          let delivDate = newOrd["delivDate"].split("T")[0];
          delivDate = delivDate.split("-");
          delivDate = delivDate[1] + "/" + delivDate[2] + "/" + delivDate[0];

          let locIDBPBN = "16VS30T9E7CM9";

          let rt = "slopick";
          let custName = newOrd["custName"];

          let prodName =
            products[
              products.findIndex((prod) =>
                newOrd["item"].includes(prod.squareID)
              )
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

          // If this update is happening after 12:01 AM -
          //      If order is for tomorrow -
          //        If Pastry -
          //           Deduct qty from back porch bakery item of same prodNick for tomorrow
          //        If Bread -
          //            ?

          // Search orders for object, if doesn't exist, add:
          let ind = orders.findIndex(
            (ord) =>
              ord["custName"] === custName && ord["prodName"] === prodName
          );

          if (ind === -1) {
            try {
              await API.graphql(
                graphqlOperation(createOrder, { input: { ...itemToAdd } })
              );
              ordsToUpdate.push(itemToAdd);
            } catch (error) {
              console.log("error on creating Orders", error);
              setIsLoading(false);
            }
          }
        }
        let DBToMod = clonedeep(database);
        DBToMod[4] = ordsToUpdate;
        setDatabase(DBToMod);
      } else {
        console.log("Square orders did not load");
      }
    }
    setDatabase(database);
    setIsLoading(false);
    setOrdersHasBeenChanged(false);
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

  const innards1 = (
    <React.Fragment>
      <BasicContainer>
        <Calendar database={database} />
      </BasicContainer>

      <BasicContainer>
        {authType === "bpbadmin" ? (
          <OrderCommandLine database={database} setDatabase={setDatabase} />
        ) : (
          ""
        )}
        <CurrentOrderInfo
          database={database}
          setDatabase={setDatabase}
          customerGroup={customerGroup}
          setCustomerGroup={setCustomerGroup}
          authType={authType}
        />
        <CurrentOrderList
          database={database}
          setDatabase={setDatabase}
          authType={authType}
        />
        <OrderEntryButtons
          database={database}
          setDatabase={setDatabase}
          authType={authType}
        />
      </BasicContainer>
    </React.Fragment>
  );

  const innards2 = (
    <React.Fragment>
      <Title>Back Porch Bakery</Title>
      <inlineContainer>
      <DateStyle>
        <CustomerGroup
          database={database}
          customerGroup={customerGroup}
          setCustomerGroup={setCustomerGroup}
        />{" "}
        order for:
      </DateStyle>
      <Calendar database={database} />
      </inlineContainer>
      <BasicContainer>
      <CurrentOrderInfo
          database={database}
          setDatabase={setDatabase}
          customerGroup={customerGroup}
          setCustomerGroup={setCustomerGroup}
          authType={authType}
        />
        <CurrentOrderList
          database={database}
          setDatabase={setDatabase}
          authType={authType}
        />
      </BasicContainer>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {width > breakpoint ? (
        <MainWindow>{innards1}</MainWindow>
      ) : (
        <MainWindowPhone>{innards2}</MainWindowPhone>
      )}
    </React.Fragment>
  );
}

export default Ordering;
