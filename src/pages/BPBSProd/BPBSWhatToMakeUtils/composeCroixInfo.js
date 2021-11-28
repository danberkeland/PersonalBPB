import { todayPlus } from "../../../helpers/dateTimeHelpers";
import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
import { getFullProdOrders } from "../../../helpers/CartBuildingHelpers";
import {
  addProdAttr,
  addFresh,
  addNeedEarly,
  addShelf,
  addPocketsQty,
} from "./utils";
import { handleFrenchConundrum } from "./conundrums";
const { DateTime } = require("luxon");

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];

const makeProds = (products, filt) => {
  let make = Array.from(
    new Set(
      products
        .filter((prod) => filt(prod))
        .map(
          (prod) =>
            prod.forBake + "_" + prod.weight.toString() + "_" + prod.doughType
        )
    )
  ).map((make) => ({
    forBake: make.split("_")[0],
    weight: Number(make.split("_")[1]),
    doughType: make.split("_")[2],
    qty: 0,
    makeTotal: 0,
    bagEOD: 0,
  }));
  return make;
};

const getFullMakeOrders = (delivDate, database) => {
  console.log("getFullMakeOrder",delivDate)
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};

const getFullProdMakeOrders = (delivDate, database) => {
  let fullOrder = getFullProdOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};

const tomBasedOnDelivDate = (delivDate) => {
  console.log("delivStart", delivDate);
  let tomorrow = DateTime.fromFormat(delivDate, "yyyy-MM-dd")
    .setZone("America/Los_Angeles")
    .plus({ days: 1 });

  return tomorrow.toString().split("T")[0];
};
export default class ComposeCroixInfo {
    returnCroixBreakDown = (database,delivDate) => {
    let openingCount = this.getOpeningCount(database,delivDate);
    let makeCount = this.getMakeCount(database,delivDate);
    let closingCount = this.getClosingCount(database,delivDate);
    let projectionCount = this.getProjectionCount(database,delivDate);
    

    return {
      openingCount: openingCount,
      makeCount: makeCount,
      closingCount: closingCount,
      projectionCount: projectionCount,
    };
  };

  getOpeningCount(database,delivDate){
    return  [
      {"prod": "pl", "qty": 15},
      {"prod": "ch", "qty": 15},
      {"prod": "pg", "qty": 15},
      {"prod": "sf", "qty": 15},
      {"prod": "mb", "qty": 15},
      {"prod": "mini", "qty": 15}
      
    ]
  }

  getMakeCount(database,delivDate){
    return [
      {"prod":"pl", "sheet": 5, "qty": 300},
      {"prod":"ch", "sheet": 6, "qty": 360},
      {"prod":"pg", "sheet": 0, "qty": 0},
      {"prod":"sf", "sheet": 6, "qty": 360},
      {"prod":"mb", "sheet": 3, "qty": 80},
      {"prod":"mini", "sheet": 3, "qty": 80}
      
    ]
  }

  getClosingCount(database,delivDate){
    return [
      {"prod": "pl", "qty": 15},
      {"prod": "ch", "qty": 15},
      {"prod": "pg", "qty": 15},
      {"prod": "sf", "qty": 15},
      {"prod": "mb", "qty": 15},
      {"prod": "mini", "qty": 15}
      
    ]
  }

  getProjectionCount(database,delivDate){
    return [
      {"prod": "pl", "tom": 150, "2day":300, "3day":450, "4day":600},
      {"prod": "ch", "tom": 150, "2day":300, "3day":450, "4day":600},
      {"prod": "pg", "tom": 150, "2day":300, "3day":450, "4day":600},
      {"prod": "sf", "tom": 150, "2day":300, "3day":450, "4day":600},
      {"prod": "mb", "tom": 150, "2day":300, "3day":450, "4day":600},
      {"prod": "mini", "tom": 150, "2day":300, "3day":450, "4day":600}
      
    ]
  }

  getPocketsNorth(database,delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let makePocketsNorth = makeProds(products, this.pocketsNorthFilter);
    console.log("getPocketsNorth",delivDate)
    let fullOrdersToday = getFullMakeOrders(delivDate, database);
    for (let make of makePocketsNorth) {
      addPocketsQty(make, fullOrdersToday);
    }
    return makePocketsNorth;
  }

  pocketsNorthFilter = (prod) => {
    let fil =
      prod.bakedWhere.includes("Mixed") &&
      Number(prod.readyTime) < 15 &&
      prod.packGroup !== "frozen pastries" &&
      prod.packGroup !== "baked pastries" &&
      prod.freezerThaw !== true;
    return fil;
  };

  getFreshProds = (database, delivDate) => {
    const [products, customers, routes, standing, orders] = database;
    let makeFreshProds = makeProds(products, this.freshProdFilter);
    let tom = tomBasedOnDelivDate(delivDate)
    let fullOrdersToday = getFullMakeOrders(delivDate, database);
    let fullOrdersTomorrow = getFullMakeOrders(tom, database);
    for (let make of makeFreshProds) {
      addFresh(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
    }
    return makeFreshProds;
  };

  freshProdFilter = (prod) => {
    let fil =
      !prod.bakedWhere.includes("Carlton") &&
      Number(prod.readyTime) < 15 &&
      prod.packGroup !== "frozen pastries" &&
      prod.packGroup !== "baked pastries";
    return fil;
  };

  getShelfProds(database,delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let makeShelfProds = makeProds(products, this.shelfProdsFilter);
    let tom = tomBasedOnDelivDate(delivDate)
    let fullOrdersToday = getFullMakeOrders(delivDate, database);
    let fullOrdersTomorrow = getFullProdMakeOrders(tom, database);
  
    for (let make of makeShelfProds) {
      addShelf(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
      addNeedEarly(make, products);
    }

    console.log("makeShelfProds",makeShelfProds)
    makeShelfProds = makeShelfProds.filter(make => (make.makeTotal + make.needEarly + make.qty)>0)

    return makeShelfProds;
  }

  shelfProdsFilter = (prod) => {
    let fil =
      !prod.bakedWhere.includes("Carlton") &&
      Number(prod.readyTime) >= 15 &&
      prod.packGroup !== "frozen pastries" &&
      prod.packGroup !== "baked pastries" &&
      prod.freezerThaw !== true;
    return fil;
  };

  getFreezerProds(database,delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let makeFreezerProds = makeProds(products, this.freezerProdsFilter);
    let tom = tomBasedOnDelivDate(delivDate)
    let fullOrdersToday = getFullMakeOrders(delivDate, database);
    let fullOrdersTomorrow = getFullProdMakeOrders(tom, database);
    for (let make of makeFreezerProds) {
      addShelf(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
      addNeedEarly(make, products);
    }
    return makeFreezerProds;
  }

  freezerProdsFilter = (prod) => {
    let fil =
      !prod.bakedWhere.includes("Carlton") &&
      Number(prod.readyTime) >= 15 &&
      prod.packGroup !== "frozen pastries" &&
      prod.packGroup !== "baked pastries" &&
      prod.freezerThaw === true;
    return fil;
  };

  getYoullBeShort = (database,delivDate) => {
    console.log("youllBeShort",delivDate)
    const [products, customers, routes, standing, orders] = database;
    let pocketsNorth = this.getPocketsNorth(database,delivDate)
      .filter((item) => item.doughType === "French")
      .map((item) => ({
        pocketWeight: item.weight,
        makeTotal: item.makeTotal,
      }));
    let shelfProds = this.getShelfProds(database,delivDate)
      .filter((item) => item.doughType === "French")
      .map((item) => ({
        pocketWeight: item.weight,
        makeTotal: item.makeTotal,
      }));
    let freshProds = this.getFreshProds(database,delivDate)
      .filter((item) => item.doughType === "French")
      .map((item) => ({
        pocketWeight: item.weight,
        makeTotal: item.makeTotal,
      }));
    let freezerProds = this.getFreezerProds(database,delivDate)
      .filter((item) => item.doughType === "French")
      .map((item) => ({
        pocketWeight: item.weight,
        makeTotal: item.makeTotal,
      }));

    let weightStr = pocketsNorth.concat(shelfProds, freshProds, freezerProds);
   
    let weightList = Array.from(
      new Set(weightStr.map((weight) => weight.pocketWeight))
    ).map((pock) => ({ pocketWeight: pock, makeTotal: 0 }));
   
    for (let weight of weightList) {
      for (let pocket of weightStr) {
        if (pocket.pocketWeight === weight.pocketWeight) {
          weight.makeTotal = weight.makeTotal + pocket.makeTotal;
        }
      }
    }

    for (let weight of weightList) {
      let availablePockets = products[products.findIndex(
        (prod) =>
          prod.weight === weight.pocketWeight && prod.doughType === "French"
      )].preshaped;
      weight.makeTotal = Number(weight.makeTotal)-Number(availablePockets)
      if (weight.makeTotal <= 0){
        weight.makeTotal = ''
      }
    }

    weightList = weightList.filter(weight => weight.makeTotal !== '')
    return weightList;
  }
}
