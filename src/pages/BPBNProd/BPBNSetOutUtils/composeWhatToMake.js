import { todayPlus } from "../../../helpers/dateTimeHelpers";

import {
  DayOneFilter,
  DayTwoFilter,
  getOrdersList,
  addUp
} from "./utils";

let tomorrow = todayPlus()[1];
let twoDay = todayPlus()[2];

export default class ComposeWhatToMake {
  returnWhatToMakeBreakDown = (delivDate, database, loc) => {
    let whatToMake = this.returnWhatToMake(delivDate, database, loc);
    return {
      whatToMake: whatToMake,
      
    };
  };

  // START
  returnWhatToMake = (delivDate, database) => {
    const [products, customers, routes, standing, orders] = database;
    let whatToMakeList = getOrdersList(tomorrow, database,true);
    console.log(whatToMakeList)
    let whatToMakeToday = whatToMakeList.filter((set) =>
      DayOneFilter(set)
    );
    console.log(whatToMakeToday);

    let whatToMakeTomList = getOrdersList(twoDay, database,true);
    let whatToMakeTomorrow = whatToMakeTomList.filter((set) =>
      DayTwoFilter(set)
    );
    console.log(whatToMakeTomorrow);
    let MakeList = whatToMakeToday.concat(whatToMakeTomorrow)
    let whatToMake = this.makeAddQty(MakeList);

    return whatToMake;
  };

  
  


  makeAddQty = (bakedTomorrow) => {
    console.log("bakedTomorrow",bakedTomorrow)
    let makeList2 = Array.from(
      new Set(bakedTomorrow.map((prod) => prod.forBake))
    ).map((mk) => ({
      forBake: mk,
      dough: '',
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
      make.qty = qtyAccToday * bakedTomorrow[bakedTomorrow.findIndex(baked => baked.forBake === make.forBake)].packSize;
      make.dough = bakedTomorrow[bakedTomorrow.findIndex(baked => baked.forBake === make.forBake)].doughType
      make.weight = bakedTomorrow[bakedTomorrow.findIndex(baked => baked.forBake === make.forBake)].weight
      make.id = bakedTomorrow[bakedTomorrow.findIndex(baked => baked.forBake === make.forBake)].prodID
      
    }
    return makeList2;
  };

  
}
