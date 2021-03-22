import { convertDatetoBPBDate } from "./dateTimeHelpers";
import { sortZtoADataByIndex, sortAtoZDataByIndex } from "./sortDataHelpers";

const { DateTime } = require("luxon");


export const removeDoubles = (orderList) => {
  for (let i = 0; i < orderList.length; ++i) {
    for (let j = i + 1; j < orderList.length; ++j) {
      if (
        orderList[i]["prodName"] === orderList[j]["prodName"] &&
        orderList[i]["custName"] === orderList[j]["custName"]
      ) {
        orderList.splice(j, 1);
      }
    }
  }
  return orderList;
};

export const zerosDelivFilter = (orderList, delivDate, customers) => {
  let noZeroDelivDateOrderList = orderList.filter(
    (ord) =>
      Number(ord["qty"]) > 0 &&
      ord["delivDate"] === convertDatetoBPBDate(delivDate)
  );
  for (let ord of noZeroDelivDateOrderList) {
    if (ord["route"] === undefined || ord["route"] === "deliv") {
      let ind = customers.findIndex(
        (cust) => cust["custName"] === ord["custName"]
      );
      if (ind > -1) {
        let custRoute = customers[ind]["zoneName"];
        ord["route"] = custRoute;
      }
    }
  }
  return noZeroDelivDateOrderList;
};

export const filterForZoneService = (
  noZeroDelivDateOrderList,
  route,
  routes
) => {
  let filterServe;
  if (routes) {
    let rtInd = routes.findIndex((rt) => rt["routeName"] === route);
    filterServe = noZeroDelivDateOrderList.filter((ord) =>
      routes[rtInd]["RouteServe"].includes(ord["route"])
    );
  }
  return filterServe;
};

export const buildGridOrderArray = (filterServe, products) => {
  let gridOrderArray;
  gridOrderArray = filterServe.map((ord) => ({
    prodName: ord["prodName"],
    custName: ord["custName"],
    zone: ord["route"],
    route: "",
    qty: ord["qty"],
    where:
      products[
        products.findIndex((prod) => prod["prodName"] === ord["prodName"])
      ]["bakedWhere"],
    when:
      products[
        products.findIndex((prod) => prod["prodName"] === ord["prodName"])
      ]["readyTime"],
  }));
  return gridOrderArray;
};

export const isZoneIncludedInRoute = (gridOrderArray, routes, delivDate, customers) => {
  sortZtoADataByIndex(routes, "routeStart");
  for (let rte of routes) {
    for (let grd of gridOrderArray) {
      let day = DateTime.fromSQL(delivDate);
      let dayNum = day.weekday;
      if (dayNum === 7) {
        dayNum = 0;
      }
      dayNum = (dayNum + 1);

      if (!rte["RouteServe"].includes(grd["zone"])) {
        continue;
      } else {
        
        if (rte["RouteSched"].includes(dayNum.toString())){
          grd["route"] = rte["routeName"];
        } else {
          grd["route"] = "Pick up Carlton"
        }
      }
      }
  }
  
  return gridOrderArray;
};

export const buildProductArray = (gridToEdit, products) => {
  let listOfProducts;

  listOfProducts = gridToEdit.map((order) => order["prodName"]);
  listOfProducts = new Set(listOfProducts);
  listOfProducts = Array.from(listOfProducts);
  let prodArray = [];
  for (let prod of listOfProducts) {
    for (let item of products) {
      if (prod === item["prodName"]) {
        let newItem = [
          prod,
          item["nickName"],
          item["packGroup"],
          item["packSize"],
        ];
        prodArray.push(newItem);
      }
    }
  }
  return prodArray;
};

export const createColumns = (listOfProducts) => {
  sortAtoZDataByIndex(listOfProducts, 2);
  let columns = [
    { field: "customer", header: "Customer", width: { width: "10%" } },
  ];
  for (let prod of listOfProducts) {
    let newCol = {
      field: prod[0],
      header: prod[1],
      width: { width: "30px" },
    };
    columns.push(newCol);
  }
  return columns;
};

export const createListOfCustomers = (orderList) => {
  let listOfCustomers = orderList.map((order) => order["custName"]);
  listOfCustomers = new Set(listOfCustomers);
  return listOfCustomers;
};

export const createQtyGrid = (listOfCustomers, orderList) => {
  let data = [];
  for (let cust of listOfCustomers) {
    let newData = { customer: cust };
    for (let order of orderList) {
      if (order["custName"] === cust) {
        newData[order["prodName"]] = order["qty"];
      }
    }

    data.push(newData);
  }

  return data;
};
