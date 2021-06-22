import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../helpers/dateTimeHelpers";
import {
  createColumns,
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../helpers/delivGridHelpers";

import { getFullOrders } from "../../../helpers/CartBuildingHelpers";

import { sortZtoADataByIndex } from "../../../helpers/sortDataHelpers";
import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "../ByRoute/Parts/utils/utils";
import { first } from "lodash";

const clonedeep = require("lodash.clonedeep");
let tomorrow = todayPlus()[1];
let today = todayPlus()[0];
let convertedToday = convertDatetoBPBDate(today);
let convertedTomorrow = convertDatetoBPBDate(tomorrow);

const addRoutes = (delivDate, prodGrid, database) => {
  const [products, customers, routes, standing, orders] = database;
  sortZtoADataByIndex(routes, "routeStart");
  for (let rte of routes) {
    for (let grd of prodGrid) {
      let dayNum = calcDayNum(delivDate);

      if (!rte["RouteServe"].includes(grd["zone"])) {
        continue;
      } else {
        if (
          routeRunsThatDay(rte, dayNum) &&
          productCanBeInPlace(grd, routes, customers, rte) &&
          productReadyBeforeRouteStarts(
            products,
            customers,
            routes,
            grd,
            rte
          ) &&
          customerIsOpen(customers, grd, routes, rte)
        ) {
          grd.route = rte.routeName;
          grd.routeDepart = rte.RouteDepart;
          grd.routeStart = rte.routeStart;
          grd.routeServe = rte.RouteServe;
          grd.routeArrive = rte.RouteArrive;
        }
      }
    }
  }
  for (let grd of prodGrid) {
    if (grd.zone === "slopick" || grd.zone === "Prado Retail") {
      grd.route = "Pick up SLO";
    }
    if (grd.zone === "atownpick" || grd.zone === "Carlton Retail") {
      grd.route = "Pick up Carlton";
    }
    if (grd.route === "slopick" || grd.route === "Prado Retail") {
      grd.route = "Pick up SLO";
    }
    if (grd.route === "atownpick" || grd.route === "Carlton Retail") {
      grd.route = "Pick up Carlton";
    }
    if (grd.route === "deliv") {
      grd.route = "NOT ASSIGNED";
    }
  }

  return prodGrid;
};

const getProdNickNames = (delivDate, database, filter) => {
  const [products, customers, routes, standing, orders] = database;
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);

  let fullNames = Array.from(
    new Set(fullOrder.filter((fu) => filter(fu)).map((fil) => fil.prodName))
  );
  let nickNames = fullNames.map(
    (fil) =>
      products[products.findIndex((prod) => fil === prod.prodName)].nickName
  );
  return nickNames;
};

const getCustNames = (delivDate, database, filter) => {
  const [products, customers, routes, standing, orders] = database;
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);

  return Array.from(
    new Set(fullOrder.filter((fu) => filter(fu)).map((fil) => fil.custName))
  );
};



const getOrdersList = (delivDate, database) => {
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
  return fullOrder
};

const makeOrders = (delivDate, database, filter) => {
  const [products, customers, routes, standing, orders] = database;
  let prodNames = getProdNickNames(delivDate, database, filter);
  let custNames = getCustNames(delivDate, database, filter);
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);

  let orderArray = [];
  for (let cust of custNames) {
    let custItem = {};
    custItem = {
      customer: cust,
    };
    for (let prod of prodNames) {
      let prodFullName =
        products[products.findIndex((pr) => pr.nickName === prod)].prodName;
      try {
        custItem[prod] =
          fullOrder[
            fullOrder.findIndex(
              (ord) => ord.prodName === prodFullName && ord.custName === cust
            )
          ].qty;
      } catch {
        custItem[prod] = null;
      }
    }
    orderArray.push(custItem);
  }
  return orderArray;
};

const addUp = (acc, val) => {
  return acc + val;
};

export default class ComposeNorthList {
  returnNorthBreakDown = (delivDate, database) => {
    let croixNorth = this.returnCroixNorth(delivDate, database);
    let shelfProdsNorth = this.returnShelfProdsNorth(database);
    let pocketsNorth = this.returnPocketsNorth(database);
    let CarltonToPrado = this.returnCarltonToPrado(database);
    let Baguettes = this.returnBaguettes(database);
    let otherRustics = this.returnOtherRustics(database);
    let retailStuff = this.returnRetailStuff(database);
    let earlyDeliveries = this.returnEarlyDeliveries(database);
    let columnsShelfProdsNorth = this.returnColumnsShelfProdsNorth(
      delivDate,
      database
    );
    let columnsPocketsNorth = this.returnColumnsPocketsNorth(
      delivDate,
      database
    );
    let columnsCarltonToPrado = this.returnColumnsCarltonToPrado(
      delivDate,
      database
    );
    let columnsBaguettes = this.returnColumnsBaguettes(delivDate, database);
    let columnsOtherRustics = this.returnColumnsOtherRustics(
      delivDate,
      database
    );
    let columnsRetailStuff = this.returnColumnsRetailStuff(delivDate, database);
    let columnsEarlyDeliveries = this.returnColumnsEarlyDeliveries(
      delivDate,
      database
    );

    // [freshProds, shelfProds] = handleFrenchConundrum(freshProds, shelfProds);

    return {
      croixNorth: croixNorth,
      shelfProdsNorth: shelfProdsNorth,
      pocketsNorth: pocketsNorth,
      CarltonToPrado: CarltonToPrado,
      Baguettes: Baguettes,
      otherRustics: otherRustics,
      retailStuff: retailStuff,
      earlyDeliveries: earlyDeliveries,
      columnsShelfProdsNorth: columnsShelfProdsNorth,
      columnsPocketsNorth: columnsPocketsNorth,
      columnsCarltonToPrado: columnsCarltonToPrado,
      columnsBaguettes: columnsBaguettes,
      columnsOtherRustics: columnsOtherRustics,
      columnsRetailStuff: columnsRetailStuff,
      columnsEarlyDeliveries: columnsEarlyDeliveries,
    };
  };

  returnCroixNorth = (delivDate, database) => {
    const [products, customers, routes, standing, orders] = database;
    let frozensOrdersList = getOrdersList(today, database);
    let frozenToday = frozensOrdersList.filter((frz) =>
      this.frzNorthFilter(frz)
    );
    frozenToday = this.makeAddFrozenQty(frozenToday);
    
    let bakedOrdersList = getOrdersList(tomorrow, database);
    let bakedTomorrow = bakedOrdersList.filter((frz) =>
      this.tomBakeFilter(frz)
    );
    bakedTomorrow = this.makeAddQty(bakedTomorrow);
    

    let combogrid = this.combineGrids(frozenToday, bakedTomorrow);
    combogrid = this.subtractCurrentStock(products, combogrid)
    combogrid = this.adjustForPackSize(combogrid);

    for (let combo of combogrid){
      combo.prodNick = combo.prodNick.substring(2)
      combo.bakedNorth = 5

      let ind = products.findIndex(prod => prod.nickName === combo.prodNick)
      let backporchbakery = products[ind].backporchbakery
      let bpbssetout = products[ind].bpbssetout
      let bpbextra = products[ind].bpbextra
      let diff = bpbssetout
      // diff = BPBS deliv of prod for today
      combo.bakedNorth = (Number(backporchbakery)/2) - (Number(diff) - Number(bpbssetout)) - Number(bpbextra)
      if (combo.bakedNorth < 0){
        combo.bakedNorth = 0
      }
    }

    

    
    return combogrid;
  };

  frzNorthFilter = (ord) => {
    return (
      ord.packGroup === "frozen pastries" &&
      ord.doughType === "Croissant" &&
      (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
    );
  };

  tomBakeFilter = (ord) => {
    return (
      ord.where.includes("Mixed") &&
      ord.packGroup === "baked pastries" &&
      ord.doughType === "Croissant" &&
      (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
    );
  };

  makeAddFrozenQty = (frozenToday) => {
    let makeList = frozenToday.map(frz => frz.prodNick)
    makeList = new Set(makeList)
    makeList = Array.from(makeList)
    makeList = makeList.map((mk) => ({
      prodNick: mk.substring(2),
      qty: 0,
    }));
    for (let make of makeList) {

      make.qty = 1;

      let qtyAccToday = 0;
      

      let qtyToday = frozenToday
        .filter((frz) => make.prodNick === frz.prodNick.substring(2))
        .map((ord) => ord.qty);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }
      make.qty = qtyAccToday;
    }
    return makeList;
  
  };

  makeAddQty = (bakedTomorrow) => {
    let makeList2 = Array.from(
      new Set(bakedTomorrow.map((prod) => prod.prodNick))
    ).map((mk) => ({
      prodNick: mk,
      qty: 0,
    }));
    for (let make of makeList2) {
      make.qty = 1;

      let qtyAccToday = 0;
      

      let qtyToday = bakedTomorrow
        .filter((frz) => make.prodNick === frz.prodNick)
        .map((ord) => ord.qty);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }
      make.qty = qtyAccToday;
    }
    return makeList2;
  
  };

  combineGrids = (obj1, obj2) => {
    console.log(obj1);
    console.log(obj2);
    let firstObject = clonedeep(obj1);
    let secondObject = clonedeep(obj2);
    for (let first of firstObject) {
      for (let sec of secondObject) {
        if (first.prodNick === sec.prodNick) {
          first.qty += sec.qty;
        }
      }
    }

    for (let sec of secondObject){
      for (let first of firstObject){
        if (sec.prodNick === first.prodNick){
          sec.qty = first.qty
          continue
        }
      }
      sec.prodNick = "fr"+sec.prodNick
    }

    return secondObject;
  };

  subtractCurrentStock = (products, grid) => {
    for ( let gr of grid){
      let subQty = products[products.findIndex(prod => prod.nickName === gr.prodNick)].currentStock
      gr.qty -=subQty
    }
    return grid
  }
    
    
    
  

  adjustForPackSize = (grid) => {
    for ( let gr of grid){
      gr.qty = Math.ceil(gr.qty/12)*12
    }
    return grid
  };

  returnPocketsNorth = (database) => {
    let shelfProds = makeOrders(today, database, this.pocketsNorthFilter);
    return shelfProds;
  };

  pocketsNorthFilter = (ord) => {
    return (
      ord.where.includes("Mixed") &&
      ord.packGroup !== "baked pastries" &&
      ord.route === "Pick up Carlton"
    );
  };

  returnShelfProdsNorth = (database) => {
    let shelfProds = makeOrders(today, database, this.shelfProdsFilter);
    return shelfProds;
  };

  shelfProdsFilter = (ord) => {
    return (
      ord.where.includes("Prado") &&
      ord.packGroup !== "frozen pastries" &&
      (ord.routeDepart === "Carlton" || ord.route === "Pick up Carlton")
    );
  };

  returnCarltonToPrado = (database) => {
    let shelfProds = makeOrders(today, database, this.CarltonToPradoFilter);
    return shelfProds;
  };

  CarltonToPradoFilter = (ord) => {
    let fil =
      ord.delivDate === convertedToday && ord.route === "Carlton to Prado";

    return fil;
  };

  returnBaguettes = (database) => {
    let shelfProds = makeOrders(today, database, this.BaguettesFilter);
    return shelfProds;
  };

  BaguettesFilter = (ord) => {
    return (
      ord.prodName === "Baguette" &&
      ord.routeDepart !== "Carlton" &&
      ord.routeArrive !== "Carlton"
    );
  };

  returnOtherRustics = (database) => {
    let shelfProds = makeOrders(today, database, this.otherRusticsFilter);
    return shelfProds;
  };

  otherRusticsFilter = (ord) => {
    return (
      ord.prodName !== "Baguette" &&
      ord.packGroup !== "retail" &&
      ord.where.includes("Carlton") &&
      ord.routeDepart === "Prado" &&
      (ord.routeStart > 8 || ord.route === "Pick up SLO")
    );
  };

  returnRetailStuff = (database) => {
    let shelfProds = makeOrders(today, database, this.retailStuffFilter);
    return shelfProds;
  };

  retailStuffFilter = (ord) => {
    return ord.packGroup === "retail" && ord.routeDepart === "Prado";
  };

  returnEarlyDeliveries = (database) => {
    let shelfProds = makeOrders(tomorrow, database, this.earlyDeliveriesFilter);
    return shelfProds;
  };

  earlyDeliveriesFilter = (ord) => {
    return (
      ord.routeDepart === "Prado" &&
      ord.where.includes("Carlton") &&
      ord.routeStart < 8
    );
  };

  returnColumnsShelfProdsNorth = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.shelfProdsFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsPocketsNorth = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.pocketsNorthFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsCarltonToPrado = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.CarltonToPradoFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsBaguettes = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.BaguettesFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsOtherRustics = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.otherRusticsFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsRetailStuff = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.retailStuffFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsEarlyDeliveries = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      tomorrow,
      database,
      this.earlyDeliveriesFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };
}
