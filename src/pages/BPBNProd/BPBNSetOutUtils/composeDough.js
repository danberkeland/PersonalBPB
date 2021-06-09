import {
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../helpers/delivGridHelpers";

import { getFullProdOrders } from "../../../helpers/CartBuildingHelpers";
import { todayPlus } from "../../../helpers/dateTimeHelpers";

import { sortZtoADataByIndex } from "../../../helpers/sortDataHelpers";
import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "../../logistics/ByRoute/Parts/utils/utils";

let threeDay = todayPlus()[3];
let twoDay = todayPlus()[2];
let oneDay = todayPlus()[1];
let tomorrow = todayPlus()[1];
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
  let fullOrder = getFullProdOrders(delivDate, database);
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
    let doughComponents = this.returnDoughComponents(delivDate, database, loc);
    let pockets = this.returnPockets(tomorrow, database, loc);
    let Baker1Dough = this.returnBaker1Doughs(delivDate, database, loc);
    let Baker1DoughComponents = this.returnBaker1DoughComponents(
      delivDate,
      database,
      loc
    );
    let Baker1Pockets = this.returnBaker1Pockets(tomorrow, database, loc);
    let bagAndEpiCount = this.returnbagAndEpiCount(tomorrow, database, loc);
    let oliveCount = this.returnoliveCount(tomorrow, database, loc);
    let bcCount = this.returnbcCount(tomorrow, database, loc);
    let bagDoughTwoDays = this.returnBagDoughTwoDays(twoDay, database, loc);
    return {
      doughs: doughs,
      doughComponents: doughComponents,
      pockets: pockets,
      Baker1Dough: Baker1Dough,
      Baker1DoughComponents: Baker1DoughComponents,
      Baker1Pockets: Baker1Pockets,
      bagAndEpiCount: bagAndEpiCount,
      oliveCount: oliveCount,
      bcCount: bcCount,
      bagDoughTwoDays: bagDoughTwoDays,
    };
  };

  returnbagAndEpiCount = (delivDate, database) => {
    const [products, customers, routes, standing, orders] = database;
    let whatToMakeList = getOrdersList(delivDate, database);

    let whatToMakeToday = whatToMakeList
      .filter((set) => this.whatToMakeFilter(set))
      .filter((bag) => bag.forBake === "Baguette" || bag.forBake === "Epi");

    let whatToMake = this.makeAddQty(whatToMakeToday);
    let qty = 0;
    for (let make of whatToMake) {
      qty += Number(make.qty);
    }

    return qty;
  };

  returnoliveCount = (delivDate, database) => {
    const [products, customers, routes, standing, orders] = database;
    let whatToMakeList = getOrdersList(delivDate, database);
    let whatToMakeToday = whatToMakeList
      .filter((set) => this.whatToMakeFilter(set))
      .filter((bag) => bag.forBake === "Olive Herb");
    let whatToMake = this.makeAddQty(whatToMakeToday);
    let qty = 0;
    for (let make of whatToMake) {
      qty += Number(make.qty);
    }
    return qty;
  };

  returnbcCount = (delivDate, database) => {
    const [products, customers, routes, standing, orders] = database;
    let whatToMakeList = getOrdersList(delivDate, database);
    let whatToMakeToday = whatToMakeList
      .filter((set) => this.whatToMakeFilter(set))
      .filter((bag) => bag.forBake === "Blue Cheese Walnut");
    let whatToMake = this.makeAddQty(whatToMakeToday);
    let qty = 0;
    for (let make of whatToMake) {
      qty += Number(make.qty);
    }
    return qty;
  };

  returnBagDoughTwoDays = (delivDate, database) => {
    const [products, customers, routes, standing, orders] = database;
    let whatToMakeList = getOrdersList(delivDate, database);
    let whatToMakeToday = whatToMakeList
      .filter((set) => this.whatToMakeFilter(set))
      .filter((bag) => bag.doughType === "Baguette");
    let qty = 0;
    for (let make of whatToMakeToday) {
      qty += Number(make.qty * make.weight);
    }

    return Math.floor(qty / 83);
  };

  returnPockets = (delivDate, database, loc) => {
    const [
      products,
      customers,
      routes,
      standing,
      orders,
      doughs,
      doughComponents,
    ] = database;
    let pocketList = getOrdersList(tomorrow, database);
    let pocketsToday = pocketList.filter((set) => this.pocketFilter(set, loc));
    pocketsToday = this.makePocketQty(pocketsToday);

    return pocketsToday;
  };

  pocketFilter = (ord, loc) => {
    return ord.doughType === "French";
  };

  makePocketQty = (bakedTomorrow) => {
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

  makeFilter = (ord, loc) => {
    return (
      
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
      ((ord.routeStart >= 8 && ord.routeDepart === "Prado") ||
        ord.routeDepart === "Carlton" ||
        ord.zone === "Prado Retail" ||
        ord.zone === "slopick")
    );
  };

  addOnFilter = (ord, loc) => {
    return (
      
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
      ((ord.routeStart < 8 && ord.routeDepart === "Prado") &&
        ord.zone !== "Prado Retail" &&
        ord.zone !== "slopick")
    );
  };

  returnDoughs = (delivDate, database, loc) => {
    const [
      products,
      customers,
      routes,
      standing,
      orders,
      doughs,
      doughComponents,
    ] = database;
    let oneDayOrderList = getOrdersList(oneDay, database);
    let oneDayMake = oneDayOrderList.filter((set) =>
      this.makeFilter(set)
    );

    let twoDayOrderAddOn = getOrdersList(twoDay, database);
    let twoDayAddon = twoDayOrderAddOn.filter((set) =>
      this.addOnFilter(set)
    );

    oneDayOrderList = oneDayMake.concat(twoDayAddon)
   
    // add two day, filter, and concat
    
    // add three day, filter, and concat
    let twoDayOrderList = getOrdersList(twoDay, database);
    let twoDayMake = twoDayOrderList.filter((set) =>
      this.makeFilter(set)
    );

    let threeDayOrderAddOn = getOrdersList(threeDay, database);
    let threeDayAddon = threeDayOrderAddOn.filter((set) =>
      this.addOnFilter(set)
    );

    twoDayOrderList = twoDayMake.concat(threeDayAddon)
    
   
    
    let doughList = Array.from(
      new Set(
        doughs
          .filter(
            (dgh) => dgh.mixedWhere === loc && dgh.doughName !== "Baguette"
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
    }));

    for (let dgh of doughList) {
      console.log(dgh)
      dgh.id =
        doughs[doughs.findIndex((d) => d.doughName === dgh.doughName)].id;
      dgh.hydration =
        doughs[
          doughs.findIndex((d) => d.doughName === dgh.doughName)
        ].hydration;
      dgh.oldDough =
        doughs[doughs.findIndex((d) => d.doughName === dgh.doughName)].oldDough;
      dgh.buffer =
        doughs[doughs.findIndex((d) => d.doughName === dgh.doughName)].buffer;
      dgh.batchSize =
        doughs[
          doughs.findIndex((d) => d.doughName === dgh.doughName)
        ].batchSize;
      if (dgh.isBakeReady === true) {
        dgh.needed = this.getDoughAmt(dgh.doughName, oneDayOrderList).toFixed(
          2
        );
      } else {
        console.log(dgh.doughName)
        console.log(twoDayOrderList)
        dgh.needed = this.getDoughAmt(dgh.doughName, twoDayOrderList).toFixed(
          2
          
        );
        console.log(dgh.needed)
      }
    }
    return doughList;
  };

  returnDoughComponents = (delivDate, database, loc) => {
    const [
      products,
      customers,
      routes,
      standing,
      orders,
      doughs,
      doughComponents,
    ] = database;
    let doughComponentInfo = doughComponents;
    return doughComponentInfo;
  };

  getDoughAmt = (doughName, orders) => {
    console.log(orders)
    let qtyAccToday = 0;
    let qtyArray = orders
      .filter((ord) => ord.doughType === doughName)
      .map((ord) => ord.qty * ord.weight * ord.packSize);
    if (qtyArray.length > 0) {
      qtyAccToday = qtyArray.reduce(addUp);
    }
    return qtyAccToday;
  };

  getPreshapedDoughAmt = (doughName, orders) => {
    let qtyAccToday = 0;
    let qtyArray = orders
      .filter((ord) => ord.doughType === doughName)
      .map((ord) => Number(ord.preshaped) * ord.weight * ord.packSize);
    if (qtyArray.length > 0) {
      qtyAccToday = qtyArray.reduce(addUp);
    }
    return qtyAccToday;
  };

  returnBaker1Pockets = (delivDate, database, loc) => {
    const [
      products,
      customers,
      routes,
      standing,
      orders,
      doughs,
      doughComponents,
    ] = database;
    let pocketList = getOrdersList(tomorrow, database);
    let pocketsToday = pocketList.filter((set) =>
      this.baker1PocketFilter(set, loc)
    );
    pocketsToday = this.makePocketQty(pocketsToday);

    return pocketsToday;
  };

  whatToMakeFilter = (ord, loc) => {
    return (
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail")
    );
  };

  baker1PocketFilter = (ord, loc) => {
    return ord.doughType === "Baguette";
  };

  returnBaker1Doughs = (delivDate, database, loc) => {
    const [
      products,
      customers,
      routes,
      standing,
      orders,
      doughs,
      doughComponents,
    ] = database;
    let twoDayOrderList = getOrdersList(twoDay, database);
    let oneDayOrderList = getOrdersList(oneDay, database);

    let doughList = Array.from(
      new Set(
        doughs
          .filter(
            (dgh) => dgh.mixedWhere === loc && dgh.doughName === "Baguette"
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

    for (let dgh of doughList) {
      dgh.id =
        doughs[doughs.findIndex((d) => d.doughName === dgh.doughName)].id;
      dgh.bucketSets =
        doughs[
          doughs.findIndex((d) => d.doughName === dgh.doughName)
        ].bucketSets;
      dgh.hydration =
        doughs[
          doughs.findIndex((d) => d.doughName === dgh.doughName)
        ].hydration;
      dgh.oldDough =
        doughs[doughs.findIndex((d) => d.doughName === dgh.doughName)].oldDough;
      dgh.buffer =
        doughs[doughs.findIndex((d) => d.doughName === dgh.doughName)].buffer;
      dgh.batchSize =
        doughs[
          doughs.findIndex((d) => d.doughName === dgh.doughName)
        ].batchSize;
      if (dgh.isBakeReady === true) {
        dgh.needed = this.getDoughAmt(dgh.doughName, oneDayOrderList).toFixed(
          2
        );
      } else {
        dgh.needed = this.getDoughAmt(dgh.doughName, twoDayOrderList).toFixed(
          2
        );
      }
      let preshaped;
      if (dgh.isBakeReady === true) {
        preshaped = this.getPreshapedDoughAmt(
          dgh.doughName,
          oneDayOrderList
        ).toFixed(2);
      } else {
        preshaped = this.getPreshapedDoughAmt(
          dgh.doughName,
          twoDayOrderList
        ).toFixed(2);
      }

      if (Number(dgh.needed) - Number(preshaped) > 0) {
        dgh.short = (Number(preshaped) - Number(dgh.needed)).toFixed(2);
      } else {
        dgh.short = 0;
      }
    }

    return doughList;
  };

  returnBaker1DoughComponents = (delivDate, database, loc) => {
    const [
      products,
      customers,
      routes,
      standing,
      orders,
      doughs,
      doughComponents,
    ] = database;
    let doughComponentInfo = doughComponents;
    return doughComponentInfo;
  };

  makeAddQty = (bakedTomorrow) => {
    let makeList2 = Array.from(
      new Set(bakedTomorrow.map((prod) => prod.forBake))
    ).map((mk) => ({
      forBake: mk,
      qty: 0,
      short: 0,
      needEarly: 0,
    }));
    for (let make of makeList2) {
      make.qty = 1;

      let qtyAccToday = 0;

      let qtyToday = bakedTomorrow
        .filter((frz) => make.forBake === frz.forBake)
        .map((ord) => ord.qty);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }

      let pocketsAccToday = 0;

      let pocketsToday = bakedTomorrow
        .filter((frz) => make.forBake === frz.forBake)
        .map((ord) => ord.preshaped);

      if (pocketsToday.length > 0) {
        pocketsAccToday = qtyAccToday - pocketsToday[0];
      }

      if (pocketsAccToday > 0) {
        make.short = "Short " + pocketsAccToday;
      } else if (pocketsAccToday < 0) {
        pocketsAccToday = -pocketsAccToday;
        make.short = "Over " + pocketsAccToday;
      } else {
        make.short = "";
      }

      let needEarlyAccToday = 0;

      let needEarlyToday = bakedTomorrow
        .filter(
          (frz) =>
            make.forBake === frz.forBake &&
            frz.routeDepart === "Carlton" &&
            frz.zone !== "Carlton Retail"
        )
        .map((ord) => ord.qty);

      if (needEarlyToday.length > 0) {
        needEarlyAccToday = needEarlyToday.reduce(addUp);
      }

      if (needEarlyAccToday > 0) {
        make.needEarly = needEarlyAccToday;
      } else {
        make.needEarly = "";
      }

      make.qty = qtyAccToday;
    }
    return makeList2;
  };
}
