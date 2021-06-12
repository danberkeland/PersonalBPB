import { todayPlus } from "../../../helpers/dateTimeHelpers";

import {
  getOrdersList,
  makePocketQty,
  addUp,
  whatToMakeList,
  qtyCalc,
} from "./utils";

import {
  DayOneFilter,
  DayTwoFilter,
  pocketFilter,
  baker1PocketFilter,
} from "./filters";

let threeDay = todayPlus()[3];
let twoDay = todayPlus()[2];
let oneDay = todayPlus()[1];
let tomorrow = todayPlus()[1];

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
    let whatToMakeToday = whatToMakeList(database, delivDate).filter(
      (bag) => bag.forBake === "Baguette" || bag.forBake === "Epi"
    );
    let whatToMake = this.makeAddQty(whatToMakeToday);
    return qtyCalc(whatToMake);
  };

  returnoliveCount = (delivDate, database) => {
    let whatToMakeToday = whatToMakeList(database, delivDate).filter(
      (bag) => bag.forBake === "Olive Herb"
    );
    let whatToMake = this.makeAddQty(whatToMakeToday);
    return qtyCalc(whatToMake);
  };

  returnbcCount = (delivDate, database) => {
    let whatToMakeToday = whatToMakeList(database, delivDate).filter(
      (bag) => bag.forBake === "Blue Cheese Walnut"
    );
    let whatToMake = this.makeAddQty(whatToMakeToday);
    return qtyCalc(whatToMake);
  };

  returnBagDoughTwoDays = (delivDate, database) => {
    let whatToMakeToday = whatToMakeList(database, delivDate).filter(
      (bag) => bag.doughType === "Baguette"
    );
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
    let pocketList = getOrdersList(tomorrow, database, true);
    let pocketsToday = pocketList.filter((set) => pocketFilter(set, loc));
    pocketsToday = makePocketQty(pocketsToday);

    return pocketsToday;
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
    let oneDayOrderList = getOrdersList(oneDay, database, true);
    let oneDayMake = oneDayOrderList.filter((set) => DayOneFilter(set));

    let twoDayOrderAddOn = getOrdersList(twoDay, database, true);
    let twoDayAddon = twoDayOrderAddOn.filter((set) => DayTwoFilter(set));

    oneDayOrderList = oneDayMake.concat(twoDayAddon);

    let twoDayOrderList = getOrdersList(twoDay, database, true);
    let twoDayMake = twoDayOrderList.filter((set) => DayOneFilter(set));

    let threeDayOrderAddOn = getOrdersList(threeDay, database, true);
    let threeDayAddon = threeDayOrderAddOn.filter((set) => DayTwoFilter(set));

    twoDayOrderList = twoDayMake.concat(threeDayAddon);

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
      let doughInd = doughs[doughs.findIndex((d) => d.doughName === dgh.doughName)];
      dgh.id = doughInd.id;
      dgh.hydration = doughInd.hydration;
      dgh.oldDough = doughInd.oldDough;
      dgh.buffer = doughInd.buffer;
      dgh.batchSize = doughInd.batchSize;
      if (dgh.isBakeReady === true) {
        dgh.needed = this.getDoughAmt(dgh.doughName, oneDayOrderList).toFixed(
          2
        );
      } else {
        dgh.needed = this.getDoughAmt(dgh.doughName, twoDayOrderList).toFixed(
          2
        );
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
    let pocketList = getOrdersList(tomorrow, database, true);
    let pocketsToday = pocketList.filter((set) => baker1PocketFilter(set, loc));
    pocketsToday = makePocketQty(pocketsToday);

    return pocketsToday;
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
    let twoDayOrderList = getOrdersList(twoDay, database, true);
    let oneDayOrderList = getOrdersList(oneDay, database, true);

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
      let doughInd =
        doughs[doughs.findIndex((d) => d.doughName === dgh.doughName)];
      dgh.id = doughInd.id;
      dgh.bucketSets = doughInd.bucketSets;
      dgh.hydration = doughInd.hydration;
      dgh.oldDough = doughInd.oldDough;
      dgh.buffer = doughInd.buffer;
      dgh.batchSize = doughInd.batchSize;
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
