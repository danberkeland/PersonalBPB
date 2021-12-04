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

import { sortAtoZDataByIndex } from "../helpers/sortDataHelpers";
import { convertDatetoBPBDate, todayPlus } from "../helpers/dateTimeHelpers";

import { API, graphqlOperation } from "aws-amplify";

const { DateTime } = require("luxon");

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

export const notesData = () => {
  const all = new Promise((resolve, reject) => {
    resolve(fetchNotesData());
  });
  
  return all;
};

const fetchNotesData = async () => {

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