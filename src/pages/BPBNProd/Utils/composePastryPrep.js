import { todayPlus } from "../../../helpers/dateTimeHelpers";

import { getOrdersList, addUp } from "./utils";

import {
  setOutFilter,
  twoDayFrozenFilter,
  threeDayAlFilter,
  pastryPrepFilter,
  almondPrepFilter,
  frozenAlmondFilter,
  setOutPlainsForAlmondsFilter
} from "./filters";
import { ceil } from "lodash";

let tomorrow = todayPlus()[1];
let twoDay = todayPlus()[2];
let threeDay = todayPlus()[3];

export default class ComposePastryPrep {
  returnPastryPrepBreakDown = (delivDate, database, loc) => {
    let setOut = this.returnSetOut(database, loc);
    let pastryPrep = this.returnPastryPrep(database, loc);
    let almondPrep = this.returnAlmondPrep(database, loc);

    return {
      setOut: setOut,
      pastryPrep: pastryPrep,
      almondPrep: almondPrep,
    };
  };

  returnSetOut = (database, loc) => {
    const products = database[0];
    let setOutList = getOrdersList(tomorrow, database, true);
    let setOutForAlmonds = getOrdersList(twoDay,database,true);
    let twoDayList = getOrdersList(twoDay, database, true);
    let threeDayList = getOrdersList(threeDay, database, true);
    let setOutToday = setOutList.filter((set) => setOutFilter(set, loc));
    console.log("setOutToday",setOutToday)
    let almondSetOut = setOutForAlmonds.filter((set) => setOutPlainsForAlmondsFilter(set,loc));
    console.log("almondSetOut",almondSetOut)
    let twoDayToday = twoDayList.filter((set) => twoDayFrozenFilter(set, loc));
    console.log("twoDayToday",twoDayToday)
    let threeDayToday = threeDayList.filter((set) =>
      threeDayAlFilter(set, loc)
    );
    console.log("threeDayToday",threeDayToday)

    for (let setout of setOutToday) {
      if (setout.custName === "Back Porch Bakery") {
        setout.qty = ceil(setout.qty/2)
      }
    }
    for (let setout of twoDayToday) {
      if (setout.custName === "Back Porch Bakery") {
        setout.qty = ceil(setout.qty/2)
      }
    }
    for (let setout of almondSetOut) {
      if (setout.custName === "Back Porch Bakery") {
        setout.qty = ceil(setout.qty/2)
      }
    }
    for (let setout of threeDayToday) {
      if (setout.custName === "Back Porch Bakery") {
        setout.qty = ceil(setout.qty/2)
      }
    }
    setOutToday = this.makeAddQty(setOutToday, products);
    almondSetOut = this.makeAddQty(almondSetOut, products);
    let twoDayPlains = this.makeAddQty(twoDayToday, products);
    let threeDayPlains = this.makeAddQty(threeDayToday, products);
    let twoDayFreeze = 0;
    let threeDayFreeze = 0;
    let almondSet = 0;
    try {
      twoDayFreeze = twoDayPlains[0].qty;
    } catch {
      twoDayFreeze = 0;
    }
    try {
      threeDayFreeze = threeDayPlains[0].qty;
    } catch {
      threeDayFreeze = 0;
    }

    try {
      almondSet = almondSetOut[0].qty;
    } catch {
      almondSet = 0;
    }

    if (loc === "Prado") {
      setOutToday[setOutToday.findIndex((set) => set.prodNick === "pl")].qty +=
        twoDayFreeze + threeDayFreeze+almondSet;
    }
    console.log("setOutToday",setOutToday)

    // Find index of 'mb'
    let mbInd = setOutToday.findIndex(ind => ind.prodNick==="mb")

    // Find index of 'unmb'
    let unmbInd = setOutToday.findIndex(ind => ind.prodNick==="unmb")

    // Add unmb.qty to mb.qty
    setOutToday[mbInd].qty += setOutToday[unmbInd].qty

    // Remove 'unmb'
    setOutToday = setOutToday.filter(ind => ind.prodNick !=="unmb")

   
    
    return setOutToday;
  };

  returnPastryPrep = (database, loc) => {
    const products = database[0];
    let setOutList = getOrdersList(tomorrow, database, true);
    let setOutToday = setOutList.filter((set) => pastryPrepFilter(set, loc));
    setOutToday = this.makeAddQty(setOutToday, products);
    return setOutToday;
  };

  returnAlmondPrep = (database, loc) => {

    // Still need to account for splitting of BPB locations and special order deductions
    
    const products = database[0];
    let setOutList = getOrdersList(tomorrow, database, true);
   
    let bakedNorthTwoDayList = getOrdersList(twoDay, database, true);

    let deliveredFrozenTomorrow = setOutList.filter((set) =>
      frozenAlmondFilter(set, loc)
    );

    let setOutToday = setOutList.filter((set) => almondPrepFilter(set, loc));
  
    bakedNorthTwoDayList = bakedNorthTwoDayList.filter((set) =>
      almondPrepFilter(set, "Carlton")
    );

   

    bakedNorthTwoDayList = bakedNorthTwoDayList.filter(
      (ord) => ord.routeDepart === "Carlton"
    );

    for (let setout of setOutToday) {
      if (setout.custName === "Back Porch Bakery") {
        setout.qty /= 2;
      }
    }
    setOutToday = this.makeAddQty(setOutToday, products);
    deliveredFrozenTomorrow = this.makeAddQty(
      deliveredFrozenTomorrow,
      products
    );

    for (let baked of bakedNorthTwoDayList) {
      if (baked.custName === "Back Porch Bakery") {
        baked.qty /= 2;
      }
    }

    bakedNorthTwoDayList = this.makeAddQty(bakedNorthTwoDayList, products);

    let bakedNorth2Day;
    let delFrozenTom;

    try {
      bakedNorth2Day = bakedNorthTwoDayList[0].qty;
    } catch {
      bakedNorth2Day = 0;
    }

    try {
      delFrozenTom = deliveredFrozenTomorrow[0].qty;
    } catch {
      delFrozenTom = 0;
    }

    let freezerAmt = delFrozenTom + bakedNorth2Day;

    let newAlmondList = [
      {
        prodNick: "fridge",
        qty: setOutToday[0].qty,
      },
      { prodNick: "freezer", qty: freezerAmt },
    ];
    return newAlmondList;
  };

  makeAddQty = (bakedTomorrow, products) => {
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
      make.id =
        products[
          products.findIndex((prod) => prod.nickName === make.prodNick)
        ].id;
    }
    return makeList2;
  };

  
}
