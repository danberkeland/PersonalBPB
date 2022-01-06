import React, { useState, useEffect, useContext, useRef } from "react";

import Calendar from "./Parts/Calendar";
import CurrentOrderInfo from "./Parts/CurrentOrderInfo";
import CurrentOrderList from "./Parts/CurrentOrderList";
import OrderCommandLine from "./Parts/OrderCommandLine";
import OrderEntryButtons from "./Parts/OrderEntryButtons";
import CustomerGroup from "./Parts/CurrentOrderInfoParts/CustomerGroup";

import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

import {
  createOrder,
  updateDough,
  updateProduct,
  deleteOrder,
} from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import {
  convertDatetoBPBDate,
  todayPlus,
  checkDeadlineStatus,
  tomBasedOnDelivDate
} from "../../helpers/dateTimeHelpers";

import { promisedData, checkForUpdates } from "../../helpers/databaseFetchers";

import { ToggleContext } from "../../dataContexts/ToggleContext";
import { CurrentDataContext } from "../../dataContexts/CurrentDataContext";

import ComposeNorthList from "../logistics/utils/composeNorthList";
import ComposeCroixInfo from "../BPBSProd/BPBSWhatToMakeUtils/composeCroixInfo";

import { getOrdersList } from "../BPBNProd/Utils/utils";

import styled from "styled-components";

const compose = new ComposeNorthList();

const { DateTime } = require("luxon");

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

const composer = new ComposeCroixInfo();

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
    deadlinePassed,
    setDeadlinePassed,
  } = useContext(ToggleContext);

  const { chosen, delivDate, setDelivDate } = useContext(CurrentDataContext);

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  const toast = useRef(null);

  const showUpdate = (message) => {
    toast.current.show({
      severity: "success",
      summary: "INITIALIZING",
      detail: message,
      life: 3000,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  useEffect(() => {
    let deadlineStatus = false;
    if (authType !== "bpbadmin") {
      deadlineStatus = checkDeadlineStatus(delivDate);
    }
    setDeadlinePassed(deadlineStatus);

    if (deadlineStatus) {
      confirmDialog({
        message:
          "6:00 PM order deadline for tomorrow has passed.  Next available order date is " +
          todayPlus()[2] +
          ". Continue?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => setDelivDate(todayPlus()[2]),
      });
    }
  }, [delivDate, authType]);

  
  useEffect(() => {
    promisedData(setIsLoading).then((database) => checkForUpdates(database,ordersHasBeenChanged,
      setOrdersHasBeenChanged, delivDate, setIsLoading)).then((database) => setDatabase(database));
    setModifications(false);
  }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps

  /*
  const NorthCroixBakeFilter = (ord) => {
    return (
      ord.where.includes("Mixed") &&
      ord.packGroup === "baked pastries" &&
      ord.doughType === "Croissant" &&
      (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
    );
  };

  const loadDatabase = async (database) => {
    setIsLoading(true);
    const [products, customers, routes, standing, orders, doughs, altPricing] =
      database;
    console.log("Checking if Orders Have been changed");
    showUpdate("updating Orders")
    if (ordersHasBeenChanged) {
      let prodsToUpdate = clonedeep(products);
      let doughsToUpdate = clonedeep(doughs);
      let ordersToUpdate = clonedeep(orders);

      console.log("Yes they have! deleting old orders");
      showUpdate("cleaning up database")
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

      console.log("Yes they have!  Updating freezerNorth numbers");
      
      try {
        let bakedOrdersList = getOrdersList(
          tomBasedOnDelivDate(today),
          database
        );
        bakedOrdersList = bakedOrdersList.filter((frz) =>
          NorthCroixBakeFilter(frz)
        );

        for (let prod of bakedOrdersList) {
          if (prod.freezerNorthFlag !== tomorrow) {
            prod.freezerNorthFlag = today;
          }

          if (prod.freezerNorthFlag === today) {
            try {
              let projectionCount = composer.getProjectionCount(
                database,
                delivDate
              );

              for (let proj of projectionCount) {
                if (prod.forBake === proj.prod) {
                  prod.freezerCount = proj.today;
                }
              }
            } catch {}

            prod.freezerNorth = prod.freezerNorthClosing;

            let frozenDelivsArray = compose.getFrozensLeavingCarlton(
              today,
              database
            );
            let frozenDeliv;
            try {
              frozenDeliv =
                frozenDelivsArray[
                  frozenDelivsArray.findIndex((fr) => fr.prod === prod.prodNick)
                ].qty;
            } catch {
              frozenDeliv = 0;
            }
            let setOutArray = compose.getBakedTomorrowAtCarlton(
              today,
              database
            );
            let setOut;
            try {
              setOut =
                setOutArray[
                  setOutArray.findIndex((set) => set.prod === prod.prodNick)
                ].qty;
            } catch {
              setOut = 0;
            }

            prod.freezerNorthClosing =
              prod.freezerNorthClosing +
              Math.ceil(
                (setOut + frozenDeliv - prod.freezerNorthClosing) / 12
              ) *
                12 -
              setOut -
              frozenDeliv +
              12;

            prod.freezerNorthFlag = tomorrow;
            let prodToUpdate = {
              id: prod.prodID,
              freezerNorth: prod.freezerNorth,
              freezerCount: prod.freezerClosing,
              freezerNorthClosing: prod.freezerNorthClosing,
              freezerNorthFlag: prod.freezerNorthFlag,
              sheetMake: 0,
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
      } catch {}

      console.log("Yes they have!  Updating preshaped numbers");
      showUpdate("updating preshaped numbers")
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
      showUpdate("Updating Prepped Bucket Numbers")
      for (let dgh of doughsToUpdate) {
        if (dgh.updatePreBucket !== tomorrow) {
          dgh.updatePreBucket = today;
        }
        if (dgh.updatePreBucket === today) {
          //  need to update correct prebucket set number
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
      showUpdate("Loading new orders from Square")
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
          let prodName;
          try {
            prodName =
              products[
                products.findIndex((prod) =>
                  newOrd["item"].includes(prod.squareID)
                )
              ]["prodName"];
          } catch {
            prodName = "Brownie";
          }

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

          let ind = orders.findIndex(
            (ord) =>
              ord["custName"] === custName && ord["prodName"] === prodName
          );

          if (ind === -1) {
            try {
              await API.graphql(
                graphqlOperation(createOrder, { input: { ...itemToAdd } })
              );
              showUpdate("New Square Order added");
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
  */

  const innards1 = (
    <React.Fragment>
      <BasicContainer>
        <Calendar database={database} />
      </BasicContainer>
      <Toast ref={toast} />
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
        {!deadlinePassed || authType === "bpbadmin" ? (
          <OrderEntryButtons
            database={database}
            setDatabase={setDatabase}
            authType={authType}
          />
        ) : (
          ""
        )}
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
            authType={authType}
          />{" "}
          order for:
        </DateStyle>
        <Calendar database={database} />
      </inlineContainer>
      <BasicContainer>
      <Toast ref={toast} />
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
