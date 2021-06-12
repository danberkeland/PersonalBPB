import { todayPlus } from "../../../helpers/dateTimeHelpers";


import {
  getOrdersList,
  addUp
} from "./utils";

let tomorrow = todayPlus()[1];


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

  
}
