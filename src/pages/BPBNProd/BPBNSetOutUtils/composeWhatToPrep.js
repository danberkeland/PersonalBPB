import { todayPlus } from "../../../helpers/dateTimeHelpers";
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

const clonedeep = require("lodash.clonedeep");
let tomorrow = todayPlus()[1];
let twoDay = todayPlus()[2];
let today = todayPlus()[0];

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

export default class ComposeWhatToMake {
  returnWhatToPrepBreakDown = (delivDate, database, loc) => {
    let whatToPrep = this.returnWhatToPrep(delivDate, database, loc);

    return {
      whatToPrep: whatToPrep,
    };
  };

  returnWhatToPrep = (delivDate, database) => {
    const [products, customers, routes, standing, orders] = database;
    let whatToPrepList = getOrdersList(delivDate, database);
    console.log(whatToPrepList)
    let whatToPrepListTom = getOrdersList(tomorrow, database);
    let whatToMakeToday = whatToPrepList.filter((set) =>
      this.whatToPrepFilter(set)
    );
    let whatToMakeTomorrow = whatToPrepListTom.filter((set) =>
      this.whatToPrepTomFilter(set)
    );
    
    let whatToMake = this.makeAddQty(whatToMakeToday);
    let whatToMakeTom = this.makeAddQty(whatToMakeTomorrow);

    
    whatToMake = whatToMake.concat(whatToMakeTom)
    return whatToMake;
  };

  whatToPrepFilter = (ord, loc) => {
    return (
      (ord.where.includes("Carlton") || ord.where.includes("Mixed")) &&
      ord.packGroup !== "rustic breads" &&
      ord.doughType !== "Croissant" &&
      ord.packGroup !== "retail" &&
      ord.packGroup !== "cafe menu" &&
      (ord.routeDepart === "Carlton"  || ord.route==="Pick up Carlton") &&
      ord.when < 14
    );
  };

  whatToPrepTomFilter = (ord, loc) => {
    return (
      (ord.where.includes("Carlton") || ord.where.includes("Mixed")) &&
      ord.packGroup !== "rustic breads" &&
      ord.doughType !== "Croissant" &&
      ord.packGroup !== "retail" &&
      ord.routeDepart === "Carlton" &&
      ord.when > 14
    );
  };

  makeAddQty = (bakedTomorrow) => {
    let makeList2 = Array.from(
      new Set(bakedTomorrow.map((prod) => prod.prodName))
    ).map((mk) => ({
      prodName: mk,
      qty: 0,
      shaped: 0,
      short: 0,
      needEarly: 0,
    }));
    for (let make of makeList2) {
      make.qty = 1;

      let qtyAccToday = 0;

      let qtyToday = bakedTomorrow
        .filter((frz) => make.prodName === frz.prodName)
        .map((ord) => ord.qty * ord.packSize);

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

    for (let sec of secondObject) {
      for (let first of firstObject) {
        if (sec.prodNick === first.prodNick) {
          sec.qty = first.qty;
          continue;
        }
      }
      sec.prodNick = "fr" + sec.prodNick;
    }

    return secondObject;
  };
}
