import { todayPlus } from "../../../helpers/dateTimeHelpers";

import {
  getOrdersList,
  addUp
} from "./utils";

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
    const [products, customers, routes, standing, orders] = database;
    let setOutList = getOrdersList(tomorrow, database,true);
    let twoDayList = getOrdersList(twoDay, database,true);
    let threeDayList = getOrdersList(threeDay, database,true);
    let setOutToday = setOutList.filter((set) => this.setOutFilter(set, loc));
   
    let twoDayToday = twoDayList.filter((set) =>
      this.twoDayFrozenFilter(set, loc)
    );
    let threeDayToday = threeDayList.filter((set) =>
      this.threeDayAlFilter(set, loc)
    );
  
    for (let setout of setOutToday){
      if (setout.custName==="Back Porch Bakery"){
        setout.qty /= 2
      }
    }
    for (let setout of twoDayToday){
      if (setout.custName==="Back Porch Bakery"){
        setout.qty /= 2
      }
    }
    console.log("setOut",setOutToday)
    console.log("2Day",twoDayToday)
    console.log("3Day",threeDayToday)
    setOutToday = this.makeAddQty(setOutToday, products);
   
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
      (ord.routeDepart === loc || ord.custName==="Back Porch Bakery") &&
      ord.custName !== "BPB Extras" &&
      ord.packGroup === "baked pastries" &&
      ord.prodNick !== "al" &&
      ord.doughType === "Croissant"
    );
  };

  twoDayFrozenFilter = (ord, loc) => {
    return (ord.prodNick === "fral" || (ord.prodNick==="al" && (ord.routeDepart===loc || ord.custName==="Back Porch Bakery"))) &&
    ord.custName !== "BPB Extras";
  };

  threeDayAlFilter = (ord, loc) => {
    return ord.routeDepart === "Carlton" && ord.prodNick === "al" &&  ord.custName !== "BPB Extras";
  };

  returnPastryPrep = (delivDate, database, loc) => {
    const [products, customers, routes, standing, orders] = database;
    let setOutList = getOrdersList(tomorrow, database,true);
    let setOutToday = setOutList.filter((set) =>
      this.pastryPrepFilter(set, loc)
    );
    console.log("setOutToday",setOutToday)
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
    let setOutList = getOrdersList(tomorrow, database,true);
    let twoDayList = getOrdersList(twoDay, database,true);
    let threeDayList = getOrdersList(threeDay, database,true);
    let setOutToday = setOutList.filter((set) => this.almondPrepFilter(set, loc));
    let twoDayToday = twoDayList.filter((set) =>
      this.frozenAlmondFilter(set, loc)
    );
    let threeDayToday = threeDayList.filter((set) =>
      this.threeDayAlFilter(set, loc)
    );
    
    for (let setout of setOutToday){
      if (setout.custName==="Back Porch Bakery"){
        setout.qty /= 2
      }
    }
    console.log(twoDayToday)
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
    return (ord.prodNick === "al" && (ord.routeDepart === loc || ord.custName === "Back Porch Bakery")) &&
    ord.custName !== "BPB Extras";
  };

  almondFridgePrepFilter = (ord, loc) => {
    return (
      ord.prodNick === "al" &&
      ord.routeDepart === "Prado"
    )
  };

  frozenAlmondFilter = (ord, loc) => {
    return (
      ord.prodNick === "fral" 
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

  
}
