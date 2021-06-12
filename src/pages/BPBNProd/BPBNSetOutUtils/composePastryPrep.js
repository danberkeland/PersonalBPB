import { todayPlus } from "../../../helpers/dateTimeHelpers";

import { getOrdersList, addUp } from "./utils";

import {
  setOutFilter,
  twoDayFrozenFilter,
  threeDayAlFilter,
  pastryPrepFilter,
  almondPrepFilter,
  frozenAlmondFilter,
} from "./filters";

let tomorrow = todayPlus()[1];
let twoDay = todayPlus()[2];
let threeDay = todayPlus()[3];

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
    const products = database[0];
    let setOutList = getOrdersList(tomorrow, database, true);
    let twoDayList = getOrdersList(twoDay, database, true);
    let threeDayList = getOrdersList(threeDay, database, true);
    let setOutToday = setOutList.filter((set) => setOutFilter(set, loc));

    let twoDayToday = twoDayList.filter((set) => twoDayFrozenFilter(set, loc));
    let threeDayToday = threeDayList.filter((set) =>
      threeDayAlFilter(set, loc)
    );

    for (let setout of setOutToday) {
      if (setout.custName === "Back Porch Bakery") {
        setout.qty /= 2;
      }
    }
    for (let setout of twoDayToday) {
      if (setout.custName === "Back Porch Bakery") {
        setout.qty /= 2;
      }
    }
    setOutToday = this.makeAddQty(setOutToday, products);
    let twoDayPlains = this.makeAddQty(twoDayToday, products);
    let threeDayPlains = this.makeAddQty(threeDayToday, products);
    let twoDayFreeze = 0;
    let threeDayFreeze = 0;
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

    if (loc === "Prado") {
      setOutToday[setOutToday.findIndex((set) => set.prodNick === "pl")].qty +=
        twoDayFreeze + threeDayFreeze;
    }
    return setOutToday;
  };

  returnPastryPrep = (delivDate, database, loc) => {
    const products = database[0];
    let setOutList = getOrdersList(tomorrow, database, true);
    let setOutToday = setOutList.filter((set) => pastryPrepFilter(set, loc));
    setOutToday = this.makeAddQty(setOutToday, products);
    return setOutToday;
  };

  returnAlmondPrep = (delivDate, database, loc) => {
    const products = database[0];
    let setOutList = getOrdersList(tomorrow, database, true);
    let twoDayList = getOrdersList(twoDay, database, true);
    let threeDayList = getOrdersList(threeDay, database, true);
    let setOutToday = setOutList.filter((set) => almondPrepFilter(set, loc));
    let twoDayToday = twoDayList.filter((set) => frozenAlmondFilter(set, loc));
    let threeDayToday = threeDayList.filter((set) =>
      threeDayAlFilter(set, loc)
    );

    for (let setout of setOutToday) {
      if (setout.custName === "Back Porch Bakery") {
        setout.qty /= 2;
      }
    }
    setOutToday = this.makeAddQty(setOutToday, products);
    let twoDayPlains = this.makeAddQty(twoDayToday, products);
    let threeDayPlains = this.makeAddQty(threeDayToday, products);
    let twoDayFreeze = 0;
    let threeDayFreeze = 0;
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
    let freezerAmt = twoDayFreeze + threeDayFreeze;
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
