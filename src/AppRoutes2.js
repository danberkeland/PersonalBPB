import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";

import Ordering from "./pages/ordering/Ordering";

import EditRoutes from "./pages/settings/editRoutes/editRoutes";
import EditZones from "./pages/settings/editZones/editZones";
import Notes from "./pages/settings/notes/Notes";

import Customers from "./pages/customers/Customers";
import Products from "./pages/products/Products";
import ByRoute from "./pages/logistics/ByRoute/ByRoute";
import ByProduct from "./pages/logistics/ByProduct/ByProduct";
import Billing from "./pages/billing/Billing";

import Loader from "./Loader";
import BPBNBaker1 from "./pages/BPBNProd/BPBNBaker1";
import BPBNBaker1Backup from "./pages/BPBNProd/BPBNBaker1Backup";
import BPBNBaker2 from "./pages/BPBNProd/BPBNBaker2";
import BPBNBaker2Backup from "./pages/BPBNProd/BPBNBaker2Backup";
import BPBNBuckets from "./pages/BPBNProd/BPBNBuckets";
import BPBNSetOut from "./pages/BPBNProd/BPBNSetOut";
import WhoBake from "./pages/BPBNProd/WhoBake";
import WhoShape from "./pages/BPBNProd/WhoShape";
import EODCounts from "./pages/EODCounts/EODCounts";
import DoughCalc from "./pages/doughCalc/doughCalc";
import BPBSWhatToMake from "./pages/BPBSProd/BPBSWhatToMake";
import BPBSWhatToMakeBackup from "./pages/BPBSProd/BPBSWhatToMakeBackup";
import BPBSMixPocket from "./pages/BPBSProd/BPBSMixPocket";
import CroixToMake from "./pages/BPBSProd/CroixToMake";
import CroixCount from "./pages/BPBSProd/CroixCount";
import AMPastry from "./pages/logistics/AMPastry";
import NorthLists from "./pages/logistics/NorthLists";
import RetailBags from "./pages/logistics/RetailBags";
import SpecialOrders from "./pages/logistics/SpecialOrders";
import FreezerThaw from "./pages/logistics/FreezerThaw";
import EditDough from "./pages/settings/editDough/editDough";
import DelivOrder from "./pages/settings/delivOrder/delivOrder";
import CustProd from "./pages/settings/custProd/custProd";
import ManageUsers from "./pages/settings/manageUsers/manageUsers";
import Voice from "./pages/settings/voice/voice";
import TestComponent from "./pages/testComponent/testComponent";

import {
  createOrder,
  updateDough,
  updateProduct,
  deleteOrder,
} from "./graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

import {
  convertDatetoBPBDate,
  todayPlus,
  checkDeadlineStatus,
  tomBasedOnDelivDate,
} from "./helpers/dateTimeHelpers";

import { promisedData } from "./helpers/databaseFetchers";

import { ToggleContext } from "./dataContexts/ToggleContext";
import { CurrentDataContext } from "./dataContexts/CurrentDataContext";

import ComposeNorthList from "./pages/logistics/utils/composeNorthList";
import ComposeCroixInfo from "./pages/BPBSProd/BPBSWhatToMakeUtils/composeCroixInfo";

import { getOrdersList } from "./pages/BPBNProd/Utils/utils";

const compose = new ComposeNorthList();
const composer = new ComposeCroixInfo();

const { DateTime } = require("luxon");

const clonedeep = require("lodash.clonedeep");

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];
let yesterday = todayPlus()[4];
let weekAgo = todayPlus()[5];

function AppRoutes({ authType, userNum }) {
  const [database, setDatabase] = useState([]);
  const [ updated, setUpdated ] = useState(1)
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
    if (updated === 2){
      updated && window.location.reload(false);
      setUpdated(3)
    }
  },[updated])

  useEffect(() => {
    promisedData(setIsLoading).then((database) => loadDatabase(database));
    setModifications(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const NorthCroixBakeFilter = (ord) => {
    return (
      ord.where.includes("Mixed") &&
      ord.packGroup === "baked pastries" &&
      ord.doughType === "Croissant" &&
      (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
    );
  };

  const loadDatabase = async (database) => {
    console.log("Just the once")
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
    setUpdated(2)
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

  return (
    <Router>
      <Loader />
      <Toast ref={toast} />
      <div className="bigPicture">
        <Switch>
          <Route
            path="/ordering"
            render={(props) => (
              <Ordering {...props} userNum={userNum} authType={authType} />
            )}
          />
          <Route path="/logistics/byRoute" component={ByRoute} />
          <Route path="/logistics/byProduct" component={ByProduct} />
          <Route path="/logistics/AMPastry" component={AMPastry} />
          <Route path="/logistics/NorthLists" component={NorthLists} />
          <Route path="/logistics/RetailBags" component={RetailBags} />
          <Route path="/logistics/SpecialOrders" component={SpecialOrders} />
          <Route path="/logistics/FreezerThaw" component={FreezerThaw} />

          <Route path="/settings/editRoutes" component={EditRoutes} />
          <Route path="/settings/editZones" component={EditZones} />
          <Route path="/settings/editDough" component={EditDough} />
          <Route path="/settings/notes" component={Notes} />
          <Route path="/settings/delivOrder" component={DelivOrder} />
          <Route path="/settings/custProd" component={CustProd} />
          <Route path="/settings/manageUsers" component={ManageUsers} />
          <Route path="/settings/voice" component={Voice} />

          <Route path="/BPBNProd/BPBNBaker1" component={BPBNBaker1} />
          <Route
            path="/BPBNProd/BPBNBaker1Backup"
            component={BPBNBaker1Backup}
          />
          <Route path="/BPBNProd/BPBNBaker2" component={BPBNBaker2} />
          <Route
            path="/BPBNProd/BPBNBaker2Backup"
            component={BPBNBaker2Backup}
          />
          <Route
            path="/BPBNProd/Buckets"
            render={(props) => <BPBNBuckets {...props} loc={"Carlton"} />}
          />
          <Route path="/BPBNProd/WhoBake" component={WhoBake} />
          <Route path="/BPBNProd/WhoShape" component={WhoShape} />
          <Route path="/doughCalc/doughCalc" component={DoughCalc} />
          <Route
            path="/BPBNProd/BPBNSetOut"
            render={(props) => <BPBNSetOut {...props} loc={"Carlton"} />}
          />

          <Route path="/BPBSProd/BPBSWhatToMake" component={BPBSWhatToMake} />
          <Route
            path="/BPBSProd/BPBSWhatToMakeBackup"
            component={BPBSWhatToMakeBackup}
          />
          <Route path="/BPBSProd/BPBSMixPocket" component={BPBSMixPocket} />
          <Route
            path="/BPBSProd/Buckets"
            render={(props) => <BPBNBuckets {...props} loc={"Prado"} />}
          />
          <Route path="/BPBSProd/CroixToMake" component={CroixToMake} />
          <Route path="/BPBSProd/CroixCount" component={CroixCount} />
          <Route
            path="/BPBSProd/BPBSSetOut"
            render={(props) => <BPBNSetOut {...props} loc={"Prado"} />}
          />
          <Route
            path="/EODCounts/BPBSCounts"
            render={(props) => <EODCounts {...props} loc={"Prado"} />}
          />
          <Route path="/doughCalc/doughCalc" component={DoughCalc} />

          <Route path="/products" component={Products} />
          <Route path="/customers" component={Customers} />
          <Route path="/billing" render={(props) => <Billing {...props} />} />
          <Route path="/billing/:code" component={Billing} />

          <Route
            path="/"
            render={(props) => (
              <Ordering {...props} userNum={userNum} authType={authType} />
            )}
          />

          <Route path="/test" exact component={TestComponent} />
        </Switch>
      </div>
    </Router>
  );
}

export default AppRoutes;
