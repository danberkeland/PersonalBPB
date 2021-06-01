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
  returnWhatToMakeBreakDown = (delivDate, database, loc) => {
    let whatToMake = this.returnWhatToMake(delivDate, database, loc);
   
    return {
      whatToMake: whatToMake,
     
      
    };
  };


  
  returnWhatToMake = (delivDate, database) => {
    const [products, customers, routes, standing, orders] = database;
    let whatToMakeList = getOrdersList(delivDate, database);
    let whatToMakeToday = whatToMakeList.filter((set) => this.whatToMakeFilter(set));
    let whatToMake = this.makeAddQty(whatToMakeToday);
    
    return whatToMake;
  };

  whatToMakeFilter = (ord, loc) => {
    return (
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail")
      
      
    );
  };

  makeAddQty = (bakedTomorrow) => {
    let makeList2 = Array.from(
      new Set(bakedTomorrow.map((prod) => prod.forBake))
    ).map((mk) => ({
      forBake: mk,
      qty: 0,
      shaped: 0,
      short: 0,
      needEarly: 0
    }));
    for (let make of makeList2) {
      make.qty = 1;

      let qtyAccToday = 0;

      let qtyToday = bakedTomorrow
        .filter((frz) => make.forBake === frz.forBake)
        .map((ord) => ord.qty*ord.packSize);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }

      let pocketsAccToday = 0;

      let pocketsToday = bakedTomorrow
        .filter((frz) => make.forBake === frz.forBake)
        .map((ord) => ord.preshaped);


      if (pocketsToday.length > 0) {
        pocketsAccToday = qtyAccToday-pocketsToday[0]
      }

      let shapedSum = bakedTomorrow
        .filter((frz) => make.forBake === frz.forBake)
        .map((ord) => ord.preshaped);

        if (shapedSum.length > 0) {
          
          make.shaped=shapedSum[0]
        }

      if (pocketsAccToday>0) {
          make.short = "Short "+pocketsAccToday
      } else if (pocketsAccToday<0) {
        pocketsAccToday = -pocketsAccToday
        make.short = "Over "+pocketsAccToday
    } else {
        make.short = ""
    }

    let needEarlyAccToday = 0;

      let needEarlyToday = bakedTomorrow
        .filter((frz) => make.forBake === frz.forBake && 
          frz.routeDepart==="Carlton" && 
          frz.routeArrive==="Carlton" && 
          frz.zone !== "Carlton Retail" &&
          frz.zone !== "atownpick")
        .map((ord) => ord.qty);

      if (needEarlyToday.length > 0) {
        needEarlyAccToday = needEarlyToday.reduce(addUp);
      }
      
      if (needEarlyAccToday>0) {
        make.needEarly = needEarlyAccToday}
     else {
      make.needEarly = ""
  }

  make.qty = qtyAccToday
      
     
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
