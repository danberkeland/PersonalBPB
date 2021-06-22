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
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};

const getFullProdMakeOrders = (delivDate, database) => {
  let fullOrder = getFullProdOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};

export default class ComposeWhatToMake {
  returnMakeBreakDown = (database) => {
    let pocketsNorth = this.getPocketsNorth(database);
    let freshProds = this.getFreshProds(database);
    let shelfProds = this.getShelfProds(database);
    let freezerProds = this.getFreezerProds(database);
    let youllBeShort = this.getYoullBeShort(database);

    [freshProds, shelfProds] = handleFrenchConundrum(freshProds, shelfProds);

    return {
      pocketsNorth: pocketsNorth,
      freshProds: freshProds,
      shelfProds: shelfProds,
      freezerProds: freezerProds,
      youllBeShort: youllBeShort,
    };
  };

  getPocketsNorth(database) {
    const [products, customers, routes, standing, orders] = database;
    let makePocketsNorth = makeProds(products, this.pocketsNorthFilter);
    let fullOrdersToday = getFullMakeOrders(today, database);
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

  getFreshProds = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let makeFreshProds = makeProds(products, this.freshProdFilter);
    console.log(makeFreshProds);
    let fullOrdersToday = getFullMakeOrders(today, database);
    let fullOrdersTomorrow = getFullMakeOrders(tomorrow, database);
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

  getShelfProds(database) {
    const [products, customers, routes, standing, orders] = database;
    let makeShelfProds = makeProds(products, this.shelfProdsFilter);
    let fullOrdersToday = getFullMakeOrders(today, database);
    let fullOrdersTomorrow = getFullProdMakeOrders(tomorrow, database);
    console.log(fullOrdersTomorrow);
    for (let make of makeShelfProds) {
      addShelf(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
      addNeedEarly(make, products);
    }

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

  getFreezerProds(database) {
    const [products, customers, routes, standing, orders] = database;
    let makeFreezerProds = makeProds(products, this.freezerProdsFilter);
    let fullOrdersToday = getFullMakeOrders(today, database);
    let fullOrdersTomorrow = getFullProdMakeOrders(tomorrow, database);
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

  getYoullBeShort = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let pocketsNorth = this.getPocketsNorth(database)
      .filter((item) => item.doughType === "French")
      .map((item) => ({
        pocketWeight: item.weight,
        makeTotal: item.makeTotal,
      }));
    let shelfProds = this.getShelfProds(database)
      .filter((item) => item.doughType === "French")
      .map((item) => ({
        pocketWeight: item.weight,
        makeTotal: item.makeTotal,
      }));
    let freshProds = this.getFreshProds(database)
      .filter((item) => item.doughType === "French")
      .map((item) => ({
        pocketWeight: item.weight,
        makeTotal: item.makeTotal,
      }));
    let freezerProds = this.getFreezerProds(database)
      .filter((item) => item.doughType === "French")
      .map((item) => ({
        pocketWeight: item.weight,
        makeTotal: item.makeTotal,
      }));

    let weightStr = pocketsNorth.concat(shelfProds, freshProds, freezerProds);
    console.log(weightStr);
    let weightList = Array.from(
      new Set(weightStr.map((weight) => weight.pocketWeight))
    ).map((pock) => ({ pocketWeight: pock, makeTotal: 0 }));
    console.log(weightList);
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
