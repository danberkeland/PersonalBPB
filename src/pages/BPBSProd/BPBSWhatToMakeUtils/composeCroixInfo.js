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
import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";
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
  console.log("getFullMakeOrder", delivDate);
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
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(item => item !== "Almond");

    let prodArray = [];
    for (let prod of prods) {
      let ind = products.findIndex((pro) => pro.forBake === prod);
      let newItem = {
        prod: prod,
        qty: products[ind].freezerCount ? products[ind].freezerCount : 0,
      };
      prodArray.push(newItem);
    }
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    return prodArray;
  }

  getOpeningNorthCount(database, delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(item => item !== "Almond");

    let prodArray = [];
    for (let prod of prods) {
      let ind = products.findIndex((pro) => pro.forBake === prod);
      let newItem = {
        prod: prod,
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
    console.log("count", count);
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(item => item !== "Almond");

    let prodArray = [];
    for (let prod of prods) {
      console.log("prod", prod);
      let ind = products.findIndex((pro) => pro.forBake === prod);
      console.log("ind", ind);
      let sheetCount = 0;
      if (products[ind].sheetMake > 0) {
        sheetCount = products[ind].sheetMake;
      }
      let newItem = {
        prod: prod,
        qty: sheetCount,
        total: products[ind].sheetMake * products[ind].batchSize,
      };
      prodArray.push(newItem);
    }
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    return prodArray;
  }

  getClosingCount(database, delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(item => item !== "Almond");

    let prodArray = [];

    for (let prod of prods) {
      let goingOut = 120
      // calcGoing out
      //     total setout today
      //     total frozen deliveries today
      //     total frozen going north today
      let ind = products.findIndex((pro) => pro.forBake === prod);
      let newItem = {
        prod: prod,
        qty:
          products[ind].freezerCount
            ? products[ind].freezerCount  - goingOut +
            (products[ind].sheetMake * products[ind].batchSize)
            : 0,
      };
      prodArray.push(newItem);
    }
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    return prodArray;
  }


  getClosingNorthCount(database, delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(item => item !== "Almond");

    let prodArray = [];

    for (let prod of prods) {
      let goingOut = 30
      // calcGoing out
      //     total setout today
      //     total frozen deliveries today
      //     total frozen going north today
      let ind = products.findIndex((pro) => pro.forBake === prod);
      let newItem = {
        prod: prod,
        qty:
          products[ind].freezerNorth
            ? products[ind].freezerNorth  - goingOut
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
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(item => item !== "Almond");

    let prodArray = [];
    for (let prod of prods) {
      let ind = products.findIndex((pro) => pro.forBake === prod);
      let newItem = {
        prod: prod,
        tom: 150,
        "2day": 300,
        "3day": 450,
        "4day": 600,
      };
      prodArray.push(newItem);
    }
    prodArray = sortAtoZDataByIndex(prodArray, "prod");
    return prodArray;
  }
}
