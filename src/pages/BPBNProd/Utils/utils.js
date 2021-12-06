import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "../../logistics/ByRoute/Parts/utils/utils";

import { pocketFilter, whatToMakeFilter, baker1PocketFilter } from "./filters";

import { sortZtoADataByIndex } from "../../../helpers/sortDataHelpers";

import {
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../helpers/delivGridHelpers";

import {
  getFullOrders,
  getFullProdOrders,
} from "../../../helpers/CartBuildingHelpers";

const clonedeep = require("lodash.clonedeep");

export const DayOneFilter = (ord, loc) => {
  return (
    ord.where.includes("Carlton") &&
    (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
    ((ord.routeStart >= 8 && ord.routeDepart === "Prado") ||
      ord.routeDepart === "Carlton" ||
      ord.route === "Pick up Carlton" ||
      ord.route === "Pick up SLO")
  );
};

export const DayTwoFilter = (ord, loc) => {
  return (
    ord.where.includes("Carlton") &&
    (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
    ord.routeStart < 8 &&
    ord.routeDepart === "Prado"
  );
};

export const addProdAttr = (fullOrder, database) => {
  const [products, customers, routes, standing, orders] = database;
  let fullToFix = clonedeep(fullOrder);

  fullToFix = fullToFix.map((full) => ({
    custName: full.custName,
    delivDate: full.delivDate,
    prodName: full.prodName,
    qty: full.qty,
  }));
  fullToFix.forEach((full) =>
    Object.assign(full, update(full, products, customers))
  );

  return fullToFix;
};

export const addSetOut = (
  make,
  fullTwoDay,
  fullOrdersTomorrow,
  routes,
  loc
) => {
  make.qty = 0;

  let qtyAccTomorrow = 0;

  let availableRoutes = routes.filter((rt) => rt.RouteDepart === loc);

  let qtyTomorrow = fullOrdersTomorrow
    .filter(
      (full) =>
        make.forBake === full.forBake &&
        checkZone(full, availableRoutes) === true
    )
    .map((ord) => ord.qty);
  if (qtyTomorrow.length > 0) {
    qtyAccTomorrow = qtyTomorrow.reduce(addUp);

    make.qty = qtyAccTomorrow;
  }
};

export const addUp = (acc, val) => {
  return acc + val;
};

const checkZone = (full, availableRoutes) => {
  for (let av of availableRoutes) {
    if (av.RouteServe.includes(full.zone)) {
      return true;
    }
  }
  return false;
};

const update = (order, products, customers) => {
  let atownPick = "atownpick";
  let ind =
    products[products.findIndex((prod) => prod.prodName === order.prodName)];
  try {
    let custInd =
      customers[
        customers.findIndex((cust) => cust.custName === order.custName)
      ];
    atownPick = custInd.zoneName;
  } catch {
    atownPick = "atownpick";
  }

  let pick = false;
  if (atownPick === "atownpick" || atownPick === "Carlton Retail") {
    pick = true;
  }

  let toAdd = {
    forBake: ind.forBake,
    freezerNorth: ind.freezerNorth,
    freezerNorthCLosing: ind.freezerNorthClosing,
    packSize: ind.packSize,
    currentStock: ind.currentStock,
    batchSize: ind.batchSize,
    bakeExtra: ind.bakeExtra,
    readyTime: ind.readyTime,
    zone: atownPick,
    atownPick: pick,
  };

  return toAdd;
};

export const addRoutes = (delivDate, prodGrid, database) => {
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

export const getOrdersList = (delivDate, database, prod) => {
  let fullOrder;
  if (prod === true) {
    fullOrder = getFullProdOrders(delivDate, database);
  } else {
    fullOrder = getFullOrders(delivDate, database);
  }
  
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
  
  return fullOrder;
};

export const makePocketQty = (bakedTomorrow) => {
  let makeList2 = Array.from(
    new Set(bakedTomorrow.map((prod) => prod.weight))
  ).map((mk) => ({
    pocketSize: mk,
    qty: 0,
  }));
  for (let make of makeList2) {
    make.qty = 1;

    let qtyAccToday = 0;

    let qtyToday = bakedTomorrow
      .filter((frz) => make.pocketSize === frz.weight)
      .map((ord) => ord.qty * ord.packSize);

    if (qtyToday.length > 0) {
      qtyAccToday = qtyToday.reduce(addUp);
    }
    make.qty = qtyAccToday;
  }
  return makeList2;
};



export const whatToMakeList = (database, delivDate) => {
  let [products, customers, routes, standing, orders] = database;
  let whatToMakeList = getOrdersList(delivDate, database, true);
  return whatToMakeList.filter((set) => whatToMakeFilter(set));
};

export const qtyCalc = (whatToMake) => {
  let qty = 0;
  for (let make of whatToMake) {
    qty += Number(make.qty);
  }
  return qty;
};

export const doughListComp = (doughs, filt,loc)=> { 
  
  return Array.from(
    new Set(
      doughs
      .filter((set) =>
      filt(set,loc)
    )
        .map((dgh) => dgh.doughName)
    )
  ).map((dgh) => ({
    doughName: dgh,
      isBakeReady:
        doughs[doughs.findIndex((dg) => dg.doughName === dgh)].isBakeReady,
      oldDough: 0,
      buffer: 0,
      needed: 0,
      batchSize: 0,
      short: 0,
      bucketSets: 0,
  }));
}


let pageMargin = 20;
let tableToNextTitle = 12;
let titleToNextTable = tableToNextTitle + 4;
let tableFont = 11;
let titleFont = 14;


export const buildTable = (title, doc, body, col, finalY) => {
  doc.setFontSize(titleFont);
  doc.text(pageMargin, finalY + tableToNextTitle, title);
  doc.autoTable({
    theme: "grid",
    body: body,
    margin: pageMargin,
    columns: col,
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
  });
};
