
import {
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
} from "../../logistics/ByRoute/Parts/utils/utils";
import { findIndex } from "lodash";


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

const getOrdersList = (delivDate, database) => {
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
  return fullOrder;
};

const addUp = (acc, val) => {
  return acc + val;
};

export default class ComposeDough {
  returnDoughBreakDown = (delivDate, database, loc) => {
    let doughs = this.returnDoughs(delivDate, database, loc);
    let doughComponents = this.returnDoughComponents(delivDate, database, loc)
    return {
      doughs: doughs,
      doughComponents: doughComponents
      
    };
  };

  returnDoughs = (delivDate, database, loc) => {
    const [products, customers, routes, standing, orders, doughs, doughComponents] = database;
    let orderList = getOrdersList(delivDate, database);
   
    let doughList = Array.from(new Set(doughs.filter(dgh => dgh.mixedWhere==="Carlton").map(dgh => dgh.doughName))).map(dgh => ({
      doughName: dgh,
      oldDough: 0,
      buffer: 0,
      needed: 0
    }))

    for (let dgh of doughList){
      dgh.id = doughs[doughs.findIndex(d => d.doughName === dgh.doughName)].id
      dgh.oldDough = doughs[doughs.findIndex(d => d.doughName === dgh.doughName)].oldDough
      dgh.buffer = doughs[doughs.findIndex(d => d.doughName === dgh.doughName)].buffer
      dgh.needed = this.getDoughAmt(dgh.doughName, orderList).toFixed(2)
    }
    return doughList;
  };

  returnDoughComponents = (delivDate, database, loc) => {
    const [products, customers, routes, standing, orders, doughs, doughComponents] = database;
    let doughComponentInfo = doughComponents
    return doughComponentInfo;
    
  };

  

  getDoughAmt = (doughName, orders) => {
    
    let qtyAccToday = 0;
    let qtyArray = orders.filter(ord => ord.doughType === doughName).map(ord => ord.qty * ord.weight)
    if (qtyArray.length > 0) {
      qtyAccToday = qtyArray.reduce(addUp);
    }
    return qtyAccToday
  }

  
}
