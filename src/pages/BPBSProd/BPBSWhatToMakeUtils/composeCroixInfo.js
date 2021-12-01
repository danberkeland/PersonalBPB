
import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";


export default class ComposeCroixInfo {
  returnCroixBreakDown = (database, delivDate,setOut) => {
    let openingCount = this.getOpeningCount(database, delivDate);
    let openingNorthCount = this.getOpeningNorthCount(database, delivDate);
    let makeCount = this.getMakeCount(database, delivDate);
    let closingCount = this.getClosingCount(database, delivDate,setOut);
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

  getClosingCount(database, delivDate,setOut) {
    const [products, customers, routes, standing, orders] = database;
    let count = products.filter(
      (prod) =>
        prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
    );
    let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(item => item !== "Almond");

    let prodArray = [];

    for (let prod of prods) {
      let goingOut = 0
      // calcGoing out
      console.log("setOut",setOut)
      
      //     total frozen deliveries today
      //     total frozen going north today
      let setOutInd
      let ind = products.findIndex((pro) => pro.forBake === prod);
      if (setOut){
        setOutInd = setOut.findIndex(set => set.prodNick === products[ind].nickName)
        goingOut = setOut[setOutInd].qty
        console.log("goingOut",goingOut)
        console.log("setOUtInd",setOutInd)
      }
      
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
