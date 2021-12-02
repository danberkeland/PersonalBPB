import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";

import { getOrdersList, addUp } from "../../BPBNProd/Utils/utils";

import { todayPlus } from "../../../helpers/dateTimeHelpers";

import {
  setOutFilter,
  twoDayFrozenFilter,
  threeDayAlFilter,
  setOutPlainsForAlmondsFilter,
} from "../../BPBNProd/Utils/filters";

import { ceil } from "lodash";
const { DateTime } = require("luxon");

const tomBasedOnDelivDate = (delivDate) => {
  let tomorrow = DateTime.fromFormat(delivDate, "yyyy-MM-dd")
    .setZone("America/Los_Angeles")
    .plus({ days: 1 });

  return tomorrow.toString().split("T")[0];
};

const TwodayBasedOnDelivDate = (delivDate) => {
  let tomorrow = DateTime.fromFormat(delivDate, "yyyy-MM-dd")
    .setZone("America/Los_Angeles")
    .plus({ days: 2 });

  return tomorrow.toString().split("T")[0];
};

const ThreedayBasedOnDelivDate = (delivDate) => {
  let tomorrow = DateTime.fromFormat(delivDate, "yyyy-MM-dd")
    .setZone("America/Los_Angeles")
    .plus({ days: 3 });

  return tomorrow.toString().split("T")[0];
};

const makeAddQty = (bakedTomorrow, products) => {
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

const returnSetOut = (database, loc, delivDate) => {
  let tom = tomBasedOnDelivDate(delivDate);
  let twoday = TwodayBasedOnDelivDate(delivDate);
  let threeday = ThreedayBasedOnDelivDate(delivDate);
  const products = database[0];
  let setOutList = getOrdersList(tom, database, true);
  let setOutForAlmonds = getOrdersList(twoday, database, true);
  let twoDayList = getOrdersList(twoday, database, true);
  let threeDayList = getOrdersList(threeday, database, true);

  let setOutToday = setOutList.filter((set) => setOutFilter(set, loc));
  

  let almondSetOut = setOutForAlmonds.filter((set) =>
    setOutPlainsForAlmondsFilter(set, loc)
  );

  let twoDayToday = twoDayList.filter((set) => twoDayFrozenFilter(set, loc));
  let threeDayToday = threeDayList.filter((set) => threeDayAlFilter(set, loc));

  for (let setout of setOutToday) {
    if (setout.custName === "Back Porch Bakery") {
      setout.qty = ceil(setout.qty / 2);
    }
  }
  for (let setout of twoDayToday) {
    if (setout.custName === "Back Porch Bakery") {
      setout.qty = ceil(setout.qty / 2);
    }
  }
  for (let setout of almondSetOut) {
    if (setout.custName === "Back Porch Bakery") {
      setout.qty = ceil(setout.qty / 2);
    }
  }
  for (let setout of threeDayToday) {
    if (setout.custName === "Back Porch Bakery") {
      setout.qty = ceil(setout.qty / 2);
    }
  }
  setOutToday = makeAddQty(setOutToday, products);
  almondSetOut = makeAddQty(almondSetOut, products);
  let twoDayPlains = makeAddQty(twoDayToday, products);
  let threeDayPlains = makeAddQty(threeDayToday, products);
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
      twoDayFreeze + threeDayFreeze + almondSet;
  }

  // Find index of 'mb'
  let mbInd = setOutToday.findIndex((ind) => ind.prodNick === "mb");

  // Find index of 'unmb'
  try {
    let unmbInd = setOutToday.findIndex((ind) => ind.prodNick === "unmb");

    // Add unmb.qty to mb.qty
    setOutToday[mbInd].qty += setOutToday[unmbInd].qty;

    // Remove 'unmb'
    setOutToday = setOutToday.filter((ind) => ind.prodNick !== "unmb");
  } catch {}

  return setOutToday;
};

const returnFreezerDelivs = (database, delivDate) => {
  let orderList = getOrdersList(delivDate, database, true);
  orderList = orderList.filter(
    (ord) =>
      ord.packGroup === "frozen pastries" && ord.doughType === "Croissant"
  );
  let frozens = [];
  let prodList = Array.from(new Set(orderList.map((pr) => pr.prodNick)));
  for (let pr of prodList) {
    let acc = 0;

    for (let or of orderList) {
      if (or.prodNick === pr) {
        acc = acc + or.qty;
      }
    }
    let newItem = { prodNick: pr, qty: acc };
    frozens.push(newItem);
  }
  console.log("frozens",frozens)
  return frozens;
};

export default class ComposeCroixInfo {
  returnCroixBreakDown = (database, delivDate) => {
    let openingCount = this.getOpeningCount(database, delivDate);
    let openingNorthCount = this.getOpeningNorthCount(database, delivDate);
    let makeCount = this.getMakeCount(database, delivDate);
    let closingCount = this.getClosingCount(database, delivDate);
    let closingNorthCount = this.getClosingNorthCount(database, delivDate);
    let projectionCount = this.getProjectionCount(database, delivDate);
    let products = this.getProducts(database);

    return {
      openingCount: openingCount,
      openingNorthCount: openingNorthCount,
      makeCount: makeCount,
      closingCount: closingCount,
      closingNorthCount: closingNorthCount,
      projectionCount: projectionCount,
      products: products,
    };
  };

  getProducts = (database) => {
    return database[0];
  };

  getOpeningCount(database, delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
      (item) => item !== "Almond"
    );

    let prodArray = [];
    for (let prod of prods) {
      let ind = products.findIndex((pro) => pro.forBake === prod);
      let newItem = {
        prod: prod,
        fixed: products[ind].freezerCount ? products[ind].freezerCount : 0,
        qty: products[ind].freezerCount ? products[ind].freezerCount : 0,
      };
      prodArray.push(newItem);
    }
    let frozenDelivs = 
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    return prodArray;
  }

  getOpeningNorthCount(database, delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
      (item) => item !== "Almond"
    );

    let prodArray = [];
    for (let prod of prods) {
      let ind = products.findIndex((pro) => pro.forBake === prod);
      let newItem = {
        prod: prod,
        fixed: products[ind].freezerNorth ? products[ind].freezerNorth : 0,
        qty: products[ind].freezerNorth ? products[ind].freezerNorth : 0,
      };
      prodArray.push(newItem);
    }
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    return prodArray;
  }

  getMakeCount(database, delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
  
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
      (item) => item !== "Almond"
    );

    let prodArray = [];
    for (let prod of prods) {
     
      let ind = products.findIndex((pro) => pro.forBake === prod);
     
      let sheetCount = 0;
      if (products[ind].sheetMake > 0) {
        sheetCount = products[ind].sheetMake;
      }
      let newItem = {
        prod: prod,
        qty: sheetCount,
        fixed: sheetCount,
        total: products[ind].sheetMake * products[ind].batchSize,
      };
      prodArray.push(newItem);
    }
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    return prodArray;
  }

  getClosingCount = (database, delivDate, setOut, setOutNorthTom) => {
    const [products, customers, routes, standing, orders] = database;
    let freezerDelivs = returnFreezerDelivs(database,todayPlus()[0])
    
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
      (item) => item !== "Almond"
    );

    let prodArray = [];

    for (let prod of prods) {
      let goingOut = 0;
      // calcGoing out
      let setOut = returnSetOut(database, "Prado", todayPlus()[0]);
      let setOutNorthTom = returnSetOut(database, "Carlton", todayPlus()[1]);
      
     

      //     total frozen deliveries today

      let setOutInd;
      let setOutNorthInd;
     
      let ind = products.findIndex((pro) => pro.forBake === prod);
      if (setOut) {
        setOutInd = setOut.findIndex(
          (set) => set.prodNick === products[ind].nickName
        );
        goingOut = setOut[setOutInd].qty;
        
      }

      if (setOutNorthTom) {
        try {
          setOutNorthInd = setOutNorthTom.findIndex(
            (set) => set.prodNick === products[ind].nickName
          );
          goingOut = goingOut + setOutNorthTom[setOutNorthInd].qty;
         
        } catch {}
      }


      let newItem = {
        prod: prod,
        fixed: products[ind].freezerCount
        ? products[ind].freezerCount -
          goingOut +
          products[ind].sheetMake * products[ind].batchSize
        : 0,
        qty: products[ind].freezerCount
          ? products[ind].freezerCount -
            goingOut +
            products[ind].sheetMake * products[ind].batchSize
          : 0,
      };
      prodArray.push(newItem);
    }
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    
    console.log("prodArray",prodArray)
    console.log("freezerDelivs",freezerDelivs)
    for (let fr of freezerDelivs){
      fr.prodNick = fr.prodNick.substring(2)
    }

    for (let prod of prodArray){
      for (let fr of freezerDelivs){
        if (fr.prodNick === prod.prod){
          prod.qty = prod.qty - fr.qty
          prod.fixed = prod.fixed - fr.qty
        }
      }
    }
   
    console.log("final",prodArray)
    return prodArray;
  }

  getClosingNorthCount = (database, delivDate) => {
    const [products, customers, routes, standing, orders] = database;
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
      (item) => item !== "Almond"
    );

    let prodArray = [];

    for (let prod of prods) {
      let goingOut = 0;

      let setOut = returnSetOut(database, "Carlton", todayPlus()[0]);

      let setOutInd;
      let ind = products.findIndex((pro) => pro.forBake === prod);
      if (setOut) {
        try {
          setOutInd = setOut.findIndex(
            (set) => set.prodNick === products[ind].nickName
          );
          goingOut = setOut[setOutInd].qty;
        } catch {}
      }

      let ind2 = products.findIndex((pro) => pro.forBake === prod);
      let newItem = {
        prod: prod,
        fixed: products[ind2].freezerNorth
        ? products[ind2].freezerNorth - goingOut
        : 0,
        qty: products[ind2].freezerNorth
          ? products[ind2].freezerNorth - goingOut
          : 0,
      };
      prodArray.push(newItem);
    }
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    return prodArray;
  }

  getProjectionCount(database, delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
      (item) => item !== "Almond"
    );

    let prodArray = [];
    for (let prod of prods) {
      let ind = products.findIndex((pro) => pro.forBake === prod);
      let newItem = {
        prod: prod,
        tom: 0,
        "2day": 0,
        "3day": 0,
        "4day": 0,
      };
      prodArray.push(newItem);
    }
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    return prodArray;
  }
}
