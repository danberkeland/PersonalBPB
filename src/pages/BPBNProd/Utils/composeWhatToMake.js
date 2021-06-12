import { todayPlus } from "../../../helpers/dateTimeHelpers";

import { DayOneFilter, DayTwoFilter, getOrdersList, addUp } from "./utils";

let tomorrow = todayPlus()[1];
let twoDay = todayPlus()[2];

export default class ComposeWhatToMake {
  returnWhatToMakeBreakDown = (database) => {
    let whatToMake = this.returnWhatToMake(database);
    return {
      whatToMake: whatToMake,
    };
  };

  returnWhatToMake = (database) => {
    let whatToMake = this.makeAddQty(
      getOrdersList(tomorrow, database, true)
        .filter((set) => DayOneFilter(set))
        .concat(
          getOrdersList(twoDay, database, true).filter((set) =>
            DayTwoFilter(set)
          )
        )
    );

    return whatToMake;
  };

  makeAddQty = (bakedTomorrow) => {
    let makeList2 = Array.from(
      new Set(bakedTomorrow.map((prod) => prod.forBake))
    ).map((mk) => ({
      forBake: mk,
      dough: "",
      weight: 0,
      qty: 0,
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

      let bakeInd =
        bakedTomorrow[
          bakedTomorrow.findIndex((baked) => baked.forBake === make.forBake)
        ];
      make.qty = qtyAccToday * bakeInd.packSize;
      make.dough = bakeInd.doughType;
      make.weight = bakeInd.weight;
      make.id = bakeInd.prodID;
    }
    return makeList2;
  };
}
