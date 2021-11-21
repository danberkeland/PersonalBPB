import { todayPlus } from "../../../helpers/dateTimeHelpers";

import {
  getOrdersList,
  makePocketQty,
  addUp,
  whatToMakeList,
  qtyCalc,
  doughListComp,
} from "./utils";

import {
  pocketFilterToday,
  pocketFilterTwoDay,
  baker1PocketFilter,
  baguette,
  noBaguette,
} from "./filters";

let twoDay = todayPlus()[2];
let oneDay = todayPlus()[1];
let tomorrow = todayPlus()[1];

export default class ComposeDough {
  returnDoughBreakDown = (database, loc) => {
    let doughs = this.returnDoughs(noBaguette, database, loc);
    let doughComponents = this.returnDoughComponents(database);
    let pockets = this.returnPockets(database, loc);
    let Baker1Dough = this.returnDoughs(baguette, database, loc);
    let Baker1Pockets = this.returnBaker1Pockets(database, loc);
    let bagAndEpiCount = this.returnbagAndEpiCount(tomorrow, database, loc);
    let oliveCount = this.returnoliveCount(tomorrow, database, loc);
    let bcCount = this.returnbcCount(tomorrow, database, loc);
    let bagDoughTwoDays = this.returnBagDoughTwoDays(twoDay, database, loc);
    return {
      doughs: doughs,
      doughComponents: doughComponents,
      pockets: pockets,
      Baker1Dough: Baker1Dough,
      Baker1DoughComponents: doughComponents,
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
    console.log("bagDoughQty",qty)
    return Math.round(qty / 82);
  };

  returnPockets = (database, loc) => {
    let pocketsTodayPrep = getOrdersList(tomorrow, database, true).filter((set) =>
      pocketFilterToday(set, loc)
    );
    console.log("pocketsTodayPrep",pocketsTodayPrep)
    let pocketsToday = makePocketQty(pocketsTodayPrep);
    console.log("pocketsToday",pocketsToday)

    let pocketsTomPrep = getOrdersList(twoDay, database, true).filter((set) =>
      pocketFilterTwoDay(set, loc)
    );
    console.log("pocketsTomPrep",pocketsTomPrep)
    let pocketsTom = makePocketQty(pocketsTomPrep);
    console.log("pocketsTom",pocketsTom)
    
    for (let item of pocketsToday){
      for (let otherItem of pocketsTom){
        if (item.pocketSize === otherItem.pocketSize){
          item.qty = item.qty+otherItem.qty
        }
      }
    }
    
    return pocketsToday;
  };

  returnDoughs = (filt, database, loc) => {
    const doughs = database[5];
    let twoDayOrderList = getOrdersList(twoDay, database, true);
    let oneDayOrderList = getOrdersList(oneDay, database, true);

    let doughList = doughListComp(doughs, filt, loc);

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

  returnDoughComponents = (database) => {
    const doughComponents = database[6];
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

  returnBaker1Pockets = (database, loc) => {
    let pocketList = getOrdersList(tomorrow, database, true);
    let pocketsToday = pocketList.filter((set) => baker1PocketFilter(set, loc));
    pocketsToday = makePocketQty(pocketsToday);

    return pocketsToday;
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
