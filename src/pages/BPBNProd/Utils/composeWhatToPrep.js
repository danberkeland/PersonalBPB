import { todayPlus } from "../../../helpers/dateTimeHelpers";

import { getOrdersList, addUp } from "./utils";

import { whatToPrepFilter, whatToPrepTomFilter } from "./filters";

let tomorrow = todayPlus()[1];

export default class ComposeWhatToMake {
  returnWhatToPrepBreakDown = (delivDate, database) => {
    let whatToPrep = this.returnWhatToPrep(delivDate, database);

    return {
      whatToPrep: whatToPrep,
    };
  };

  returnWhatToPrep = (delivDate, database) => {
    let whatToPrepList = getOrdersList(delivDate, database);
  
    let whatToPrepListTom = getOrdersList(tomorrow, database);
    let whatToMakeToday = whatToPrepList.filter((set) => whatToPrepFilter(set));
    let whatToMakeTomorrow = whatToPrepListTom.filter((set) =>
      whatToPrepTomFilter(set)
    );

    let whatToMake = this.makeAddQty(whatToMakeToday);
    let whatToMakeTom = this.makeAddQty(whatToMakeTomorrow);

    whatToMake = whatToMake.concat(whatToMakeTom);
    return whatToMake;
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
