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
} from "../graphql/queries";

import { sortAtoZDataByIndex } from "../helpers/sortDataHelpers";

import { API, graphqlOperation } from "aws-amplify";

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
  let dough = await fetchFromDataBase(
    listDoughs,
    "listDoughs",
    "1000"
  );
  return dough;
}

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
}

export const fetchNotes = async () => {
  let notes = await fetchFromDataBase(
    listNotess,
    "listNotess",
    "1000"
  );
  return notes;
}

export const fetchOrders = async () => {
  let ordList = await fetchFromDataBase(listOrders, "listOrders", "5000");
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
  let products = await fetchProducts();
  let customers = await fetchCustomers();
  let routes = await fetchRoutes();
  let standing = await fetchStanding();
  let orders = await fetchOrders();
  let doughs = await fetchDoughs();
  let doughComponents = await fetchDoughComponents();
  let data = [products, customers, routes, standing, orders, doughs, doughComponents];
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
  setIsLoading(true);
  let notes = await fetchNotes();
  setIsLoading(false);
  if (!notes){ 
    return []
  } else {
    return notes;
  }
  
};