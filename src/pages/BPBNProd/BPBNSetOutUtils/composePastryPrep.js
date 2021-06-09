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
import { set } from "lodash";

const clonedeep = require("lodash.clonedeep");
let tomorrow = todayPlus()[1];
let twoDay = todayPlus()[2];
let threeDay = todayPlus()[3];

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

export default class ComposePastryPrep {
  returnPastryPrepBreakDown = (delivDate, database, loc) => {
    let setOut = this.returnSetOut(delivDate, database, loc);
    let pastryPrep = this.returnPastryPrep(delivDate, database, loc);
    let almondPrep = this.returnAlmondPrep(delivDate, database, loc);

    return {
      setOut: setOut,
      pastryPrep: pastryPrep,
      almondPrep: almondPrep,
    };
  };

  returnSetOut = (delivDate, database, loc) => {
    const [products, customers, routes, standing, orders] = database;
    let setOutList = getOrdersList(tomorrow, database);
    let twoDayList = getOrdersList(twoDay, database);
    let threeDayList = getOrdersList(threeDay, database);
    let setOutToday = setOutList.filter((set) => this.setOutFilter(set, loc));
   
    let twoDayToday = twoDayList.filter((set) =>
      this.twoDayFrozenFilter(set, loc)
    );
    let threeDayToday = threeDayList.filter((set) =>
      this.threeDayAlFilter(set, loc)
    );
    console.log(setOutToday)
    for (let setout of setOutToday){
      if (setout.custName==="Back Porch Bakery"){
        setout.qty /= 2
      }
    }
    setOutToday = this.makeAddQty(setOutToday, products);
    console.log(setOutToday)
    let twoDayPlains = this.makeAddQty(twoDayToday,products);
    let threeDayPlains = this.makeAddQty(threeDayToday,products);
    let twoDayFreeze = 0;
    let threeDayFreeze = 0;
    try {
      twoDayFreeze = twoDayPlains[0].qty
    } catch {
      twoDayFreeze = 0;
    }
    try {
      threeDayFreeze = threeDayPlains[0].qty
    } catch {
      threeDayFreeze = 0;
    }
  
    if (loc === "Prado") {
      setOutToday[setOutToday.findIndex((set) => set.prodNick === "pl")].qty +=
      twoDayFreeze + threeDayFreeze;
    }
    return setOutToday;
  };

  setOutFilter = (ord, loc) => {
    return (
      ord.routeDepart === loc &&
      ord.packGroup === "baked pastries" &&
      ord.prodNick !== "al" &&
      ord.doughType === "Croissant"
    );
  };

  twoDayFrozenFilter = (ord, loc) => {
    return ord.prodNick === "fral" && loc === "Prado";
  };

  threeDayAlFilter = (ord, loc) => {
    return ord.routeDepart === loc && ord.prodNick === "al";
  };

  returnPastryPrep = (delivDate, database, loc) => {
    const [products, customers, routes, standing, orders] = database;
    let setOutList = getOrdersList(tomorrow, database);
    let setOutToday = setOutList.filter((set) =>
      this.pastryPrepFilter(set, loc)
    );
    setOutToday = this.makeAddQty(setOutToday, products);

   
    return setOutToday;
  };

  pastryPrepFilter = (ord, loc) => {
    return (
      (ord.where.includes(loc) &&
        ord.packGroup === "baked pastries" &&
        ord.doughType !== "Croissant") ||
      (ord.where.includes("Mixed") &&
        ord.routeDepart === loc &&
        ord.packGroup === "baked pastries" &&
        ord.doughType !== "Croissant")
    );
  };

  returnAlmondPrep = (delivDate, database, loc) => {
    const [products, customers, routes, standing, orders] = database;
    let setOutList = getOrdersList(tomorrow, database);
    let twoDayList = getOrdersList(twoDay, database);
    let threeDayList = getOrdersList(threeDay, database);
    let setOutToday = setOutList.filter((set) => this.setOutFilter(set, loc));
    let twoDayToday = twoDayList.filter((set) =>
      this.twoDayFrozenFilter(set, loc)
    );
    let threeDayToday = threeDayList.filter((set) =>
      this.threeDayAlFilter(set, loc)
    );

    setOutToday = this.makeAddQty(setOutToday,products);
    let twoDayPlains = this.makeAddQty(twoDayToday,products);
    let threeDayPlains = this.makeAddQty(threeDayToday,products);
    let twoDayFreeze = 0;
    let threeDayFreeze = 0;
    try {
      twoDayFreeze = twoDayPlains[0].qty
    } catch {
      twoDayFreeze = 0;
    }
    try {
      threeDayFreeze = threeDayPlains[0].qty
    } catch {
      threeDayFreeze = 0;
    }
    let freezerAmt = twoDayFreeze + threeDayFreeze
    let newAlmondList = [
      {
        prodNick: "fridge",
        qty: setOutToday[0].qty,
      },
      { prodNick: "freezer", qty: freezerAmt },
    ];
    return newAlmondList;
  };

  almondPrepFilter = (ord, loc) => {
    return ord.prodNick === "al";
  };

  almondFridgePrepFilter = (ord, loc) => {
    return (
      ord.prodNick === "al" &&
      ord.routeDepart === "Prado"
    )
  };

  makeAddQty = (bakedTomorrow, products) => {
    console.log(products)
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
      make.id = products[products.findIndex(prod => prod.nickName === make.prodNick)].id
     
     
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
