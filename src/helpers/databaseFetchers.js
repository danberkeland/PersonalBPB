import {
  listProducts,
  listCustomers,
  listRoutes,
  listStandings,
  listOrders,
  listAltPricings,
  listDoughs,
  listDoughComponents,
  listNotess,
  listZones,
  listInfoQBAuths
} from "../graphql/queries";

import {
  createOrder,
  updateDough,
  updateProduct,
  deleteOrder,
} from "../graphql/mutations";


import { sortAtoZDataByIndex } from "../helpers/sortDataHelpers";
import { convertDatetoBPBDate,
  todayPlus,
  checkDeadlineStatus,
  tomBasedOnDelivDate } from "../helpers/dateTimeHelpers";

import { API, graphqlOperation } from "aws-amplify";

import { getOrdersList } from "../pages/BPBNProd/Utils/utils";
import ComposeNorthList from "../pages/logistics/utils/composeNorthList";
import ComposeCroixInfo from "../pages/BPBSProd/BPBSWhatToMakeUtils/composeCroixInfo";

const clonedeep = require("lodash.clonedeep");
const { DateTime } = require("luxon");

const composer = new ComposeCroixInfo();
const compose = new ComposeNorthList();

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];
let yesterday2 = todayPlus()[4];
let weekAgo = todayPlus()[5];

let yesterday = convertDatetoBPBDate(todayPlus()[4]);
console.log(yesterday);

const buildDateTime = (string) => {
  return DateTime.fromFormat(string, "yyyy/dd/MM").toISO();
};

const fetchFromDataBase = async (baseFunc, base, limit) => {
  try {
    const data = await API.graphql(
      graphqlOperation(baseFunc, { limit: limit })
    );
    
    const list = data.data[base].items;
    return list;
  } catch (error) {
    console.log(`error on fetching ${base} data`, error);
  }
};

const fetchFromDataBaseWithFilter = async (baseFunc, base, limit, filt) => {
  try {
    const data = await API.graphql(
      graphqlOperation(baseFunc, {
        limit: limit,
        filter: filt,
      })
    );
   
    const list = data.data[base].items;
    
    return list;
  } catch (error) {
    console.log(`error on fetching ${base} data`, error);
  }
};

export const fetchProducts = async () => {
  let prodList = await fetchFromDataBase(listProducts, "listProducts", "500");
  sortAtoZDataByIndex(prodList, "prodName");
  return prodList;
};

export const fetchCustomers = async () => {
  let custList = await fetchFromDataBase(listCustomers, "listCustomers", "500");
  sortAtoZDataByIndex(custList, "custName");
  custList = custList.filter((cust) => cust["_deleted"] !== true);
  return custList;
};

export const fetchRoutes = async () => {
  let routeList = await fetchFromDataBase(listRoutes, "listRoutes", "500");
  sortAtoZDataByIndex(routeList, "routeStart");
  return routeList;
};

export const fetchStanding = async () => {
  let standList = await fetchFromDataBase(
    listStandings,
    "listStandings",
    "5000"
  );
  let noDelete = standList.filter((stand) => stand["_deleted"] !== true);
  let sortedData = sortAtoZDataByIndex(noDelete, "timeStamp");
  return sortedData;
};

export const fetchDoughs = async () => {
  let dough = await fetchFromDataBase(listDoughs, "listDoughs", "1000");
  return dough;
};

export const fetchDoughComponents = async () => {
  let doughComponents = await fetchFromDataBase(
    listDoughComponents,
    "listDoughComponents",
    "1000"
  );
  return doughComponents;
};

export const fetchAltPricing = async () => {
  let altPricing = await fetchFromDataBase(
    listAltPricings,
    "listAltPricings",
    "1000"
  );
  return altPricing;
};

export const fetchQBInfo = async () => {
  let QBInfo = await fetchFromDataBase(
    listInfoQBAuths,
    "listInfoQBAuths",
    "1000"
  );
  return QBInfo;
};

export const fetchNotes = async () => {
  let notes = await fetchFromDataBase(listNotess, "listNotess", "1000");
  return notes;
};

export const fetchOrders = async () => {
  

  let ordList = await fetchFromDataBaseWithFilter(
    listOrders,
    "listOrders",
    "5000"
    
  );
  let noDelete = ordList.filter((cust) => cust["_deleted"] !== true);
  let sortedData = sortAtoZDataByIndex(noDelete, "timeStamp");
  sortedData = sortAtoZDataByIndex(sortedData, "prodName");
  
  return sortedData;
};

export const promisedData = (setIsLoading) => {
  
  const all = new Promise((resolve, reject) => {
    resolve(fetchData(setIsLoading));
  });
 
  return all;
};

const fetchData = async (setIsLoading) => {
  setIsLoading(true);
 
  console.log("Fetching Product Info")
  let products = await fetchProducts();
  console.log("Fetching Customer Info")
  let customers = await fetchCustomers();
  console.log("Fetching Route Info")
  let routes = await fetchRoutes();
  console.log("Fetching Standing Info")
  let standing = await fetchStanding();
  console.log("Fetching Order Info")
  let orders = await fetchOrders();
  console.log("Fetching Dough Info")
  let doughs = await fetchDoughs();
  console.log("Fetching Dough Components Info")
  let doughComponents = await fetchDoughComponents();
  console.log("Fetching AltPricing Info")
  let altPricing = await fetchAltPricing();
  console.log("Fetching QBInfo")
  let QBInfo = await fetchQBInfo();
  let data = [
    products,
    customers,
    routes,
    standing,
    orders,
    doughs,
    doughComponents,
    altPricing,
    QBInfo
  ];
  setIsLoading(false);
  
  return data;
};

export const notesData = (setIsLoading) => {
  const all = new Promise((resolve, reject) => {
    resolve(fetchNotesData(setIsLoading));
  });
  
  return all;
};

const fetchNotesData = async (setIsLoading) => {

  let notes = await fetchNotes();
  
  if (!notes) {
    return [];
  } else {
    return notes;
  }
};


export const fetchInfo = async (operation, opString, limit) => {
  try {
    let info = await API.graphql(
      graphqlOperation(operation, {
        limit: limit,
      })
    );
    let list = info.data[opString].items;

    let noDelete = list.filter((li) => li["_deleted"] !== true);
    return noDelete;
  } catch {
    return [];
  }
};

export const fetchZones = async () => {
  try {
    let zones = await fetchInfo(listZones, "listZones", "50");
    return zones
  } catch (error) {
    console.log("error on fetching Zone List", error);
  }
};


export const checkForUpdates = async (db,ordersHasBeenChanged,
  setOrdersHasBeenChanged, delivDate) => {
  
    const [products, customers, routes, standing, orders, doughs, altPricing] =
      db;
    console.log("Checking if Orders Have been changed");
   
    if (ordersHasBeenChanged) {
      let prodsToUpdate = clonedeep(products);
      let doughsToUpdate = clonedeep(doughs);
      let ordersToUpdate = clonedeep(orders);

      console.log("Yes they have! deleting old orders");
      
      let newYest = convertDatetoBPBDate(yesterday2);
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
            
          }
        }
      }

      console.log("Yes they have!  Updating freezerNorth numbers");
      
      try {
        let bakedOrdersList = getOrdersList(
          tomBasedOnDelivDate(today),
          db
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
                db,
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
              db
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
              db
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
              
            }
          }
        }
      } catch {}

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
            
          }
        }
      }

      console.log("Yes they have!  Updating prepped bucket numbers");
      
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
           
          }
        }
      }

      console.log("Yes they have!  Loading new Square Orders in DB");
      
      let ordsToUpdate = clonedeep(orders);
      
      let ord = await fetchSq(db);
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
             
              ordsToUpdate.push(itemToAdd);
            } catch (error) {
              console.log("error on creating Orders", error);
              
            }
          }
        }
        let DBToMod = clonedeep(db);
        DBToMod[4] = ordsToUpdate;
        setOrdersHasBeenChanged(false);
        return DBToMod
       
      } else {
        console.log("Square orders did not load");
      }
    }
   
    setOrdersHasBeenChanged(false);

    return db
    
}


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



const NorthCroixBakeFilter = (ord) => {
  return (
    ord.where.includes("Mixed") &&
    ord.packGroup === "baked pastries" &&
    ord.doughType === "Croissant" &&
    (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
  );
};