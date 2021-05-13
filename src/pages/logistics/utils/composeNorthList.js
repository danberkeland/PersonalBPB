import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../helpers/dateTimeHelpers";
import {
  createColumns,
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../helpers/delivGridHelpers";

import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
import { addProdAttr, addCroixBakedAndFrozen } from "./utils";

import { sortZtoADataByIndex } from "../../../helpers/sortDataHelpers";
import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "../ByRoute/Parts/utils/utils";

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];
let convertedToday = convertDatetoBPBDate(today);
let convertedTomorrow = convertDatetoBPBDate(tomorrow);

const addRoutes = (delivDate, prodGrid, database) => {
  const [products, customers, routes, standing, orders] = database;
  sortZtoADataByIndex(routes, "routeStart");
  for (let rte of routes) {
    for (let grd of prodGrid) {
      let dayNum = calcDayNum(delivDate);

      if (!rte["RouteServe"].includes(grd["zone"])) {
        continue;
      } else {
        if (
          routeRunsThatDay(rte, dayNum) &&
          productCanBeInPlace(grd, routes, customers, rte) &&
          productReadyBeforeRouteStarts(
            products,
            customers,
            routes,
            grd,
            rte
          ) &&
          customerIsOpen(customers, grd, routes, rte)
        ) {
          grd.route = rte.routeName;
          grd.routeDepart = rte.RouteDepart;
          grd.routeStart = rte.routeStart;
          grd.routeServe = rte.RouteServe;
        }
      }
    }
  }
  for (let grd of prodGrid) {
    if (grd.zone === "slopick" || grd.zone === "Prado Retail") {
      grd.route = "Pick up SLO";
    }
    if (grd.zone === "atownpick" || grd.zone === "Carlton Retail") {
      grd.route = "Pick up Carlton";
    }
    if (grd.route === "slopick" || grd.route === "Prado Retail") {
      grd.route = "Pick up SLO";
    }
    if (grd.route === "atownpick" || grd.route === "Carlton Retail") {
      grd.route = "Pick up Carlton";
    }
    if (grd.route === "deliv") {
      grd.route = "NOT ASSIGNED";
    }
  }

 
  return prodGrid;
};

const getProdNickNames = (delivDate, database, filter) => {
  const [products, customers, routes, standing, orders] = database;
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
  
  let fullNames = Array.from(
    new Set(
      fullOrder
        .filter(fu => 
          filter
        )
        .map((fil) => fil.prodName)
    )
  );
  let nickNames = fullNames.map(
    (fil) =>
      products[products.findIndex((prod) => fil === prod.prodName)].nickName
  );
  return nickNames;
  
};

const getCustNames = (delivDate, database, filter) => {
  
  const [products, customers, routes, standing, orders] = database;
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
  
  return Array.from(
    new Set(
      fullOrder
        .filter(fu => 
          filter
        )
        .map((fil) => fil.custName)
    )
  );
};

const makeCroixNorth = (products, filt) => {
  let make = Array.from(
    new Set(products.filter((prod) => filt(prod)).map((prod) => prod.nickName))
  ).map((make) => ({
    prodName: make,
    baked: 0,
    frozen: 0,
  }));
  return make;
};

const getCroixNorth = (delivDate, database) => {
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};


const makeOrders = (delivDate, database, filter) => {
 
  const [products, customers, routes, standing, orders] = database;
  let prodNames = getProdNickNames(delivDate, database, filter);
  let custNames = getCustNames(delivDate, database, filter);
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
  
  let orderArray = [];
  for (let cust of custNames) {
    let custItem = {};
    custItem = {
      customer: cust,
    };
    for (let prod of prodNames) {
      let prodFullName =
        products[products.findIndex((pr) => pr.nickName === prod)].prodName;
      try {
        custItem[prod] =
          fullOrder[
            fullOrder.findIndex(ord => ord.prodName === prodFullName &&
              ord.custName === cust
             
            )
          ].qty;
      } catch {
        custItem[prod] = null;
      }
    }
    orderArray.push(custItem);
  }
  return orderArray;
};

export default class ComposeNorthList {
  returnNorthBreakDown = (database) => {
    let croixNorth = this.returnCroixNorth(database);
    let shelfProdsNorth = this.returnShelfProdsNorth(database);
    /*
    let CarltonToPrado = this.returnCarltonToPrado(database);
    let Baguettes = this.returnBaguettes(database);
    let otherRustics = this.returnOtherRustics(database);
    let retailStuff = this.returnRetailStuff(database);
    let earlyDeliveries = this.returnEarlyDeliveries(database);
    */
    let columnsShelfProdsNorth = this.returnColumnsShelfProdsNorth(database);
    /*
    let columnsCarltonToPrado = this.returnColumnsCarltonToPrado(database);
    let columnsBaguettes = this.returnColumnsBaguettes(database);
    let columnsOtherRustics = this.returnColumnsOtherRustics(database);
    let columnsRetailStuff = this.returnColumnsRetailStuff(database);
    let columnsEarlyDeliveries = this.returnColumnsEarlyDeliveries(database);
    */
    // [freshProds, shelfProds] = handleFrenchConundrum(freshProds, shelfProds);

    return {
      croixNorth: croixNorth,
      shelfProdsNorth: shelfProdsNorth,
      /*
      CarltonToPrado: CarltonToPrado,
      Baguettes: Baguettes,
      otherRustics: otherRustics,
      retailStuff: retailStuff,
      earlyDeliveries: earlyDeliveries,
      */
      columnsShelfProdsNorth: columnsShelfProdsNorth,
      /*
      columnsCarltonToPrado: columnsCarltonToPrado,
      columnsBaguettes: columnsBaguettes,
      columnsOtherRustics: columnsOtherRustics,
      columnsRetailStuff: columnsRetailStuff,
      columnsEarlyDeliveries: columnsEarlyDeliveries,
      */
    };
  };

  returnCroixNorth = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let croixNorth = makeCroixNorth(products, this.croixNorthFilter);
    let fullOrdersTomorrow = getCroixNorth(tomorrow, database);
    for (let croix of croixNorth) {
      addCroixBakedAndFrozen(croix, fullOrdersTomorrow);
    }
    return croixNorth;
  };

  croixNorthFilter = (prod) => {
    let fil =
      prod.doughType === "Croissant" && prod.packGroup === "baked pastries";

    return fil;
  };

  returnShelfProdsNorth = (database) => {
    let shelfProds = makeOrders(today, database, this.shelfProdsFilter);
    console.log(shelfProds)
    return shelfProds;
  };

  shelfProdsFilter = (ord) => {
    return (
      ord.where.includes("Prado") &&
      ord.packGroup !== "frozen pastries" &&
      ord.routeDepart === "Carlton"

    )
  };
  /*
  returnCarltonToPrado = (database) => {
    let shelfProds = makeOrders(today, database);
    return shelfProds;
  };

  CarltonToPradoFilter = (ord) => {
    let fil =
      ord.delivDate === convertedToday && ord.route === "Carlton to Prado";

    return fil;
  };

  returnBaguettes = (database) => {
    let shelfProds = makeOrders(today, database);
    return shelfProds;
  };

  BaguettesFilter = (ord) => {
    let fil =
      ord.prodName === "Baguette" &&
      ord.delivDate === convertedToday &&
      ord.routeDepart !== "Carlton";

    return fil;
  };

  returnOtherRustics = (database) => {
    let shelfProds = makeOrders(today, database);
    return shelfProds;
  };

  otherRusticsFilter = (ord) => {
    let fil =
      ord.bakedWhere.includes("Carlton") &&
      ord.packGroup !== "retail" &&
      ord.custName !== "Lucy's Coffee Shop" &&
      ord.prodName !== "Baguette" &&
      ord.delivDate === convertedToday &&
      ord.routeDepart !== "Carlton";

    return fil;
  };

  returnRetailStuff = (database) => {
    let shelfProds = makeOrders(today, database);
    return shelfProds;
  };

  retailStuffFilter = (ord) => {
    let fil =
      ord.bakedWhere.includes("Carlton") &&
      ord.packGroup === "retail" &&
      ord.delivDate === convertedToday &&
      ord.routeDepart !== "Carlton";

    return fil;
  };

  returnEarlyDeliveries = (database) => {
    let shelfProds = makeOrders(today, database);
    return shelfProds;
  };

  earlyDeliveriesFilter = (ord) => {
    let fil =
      ord.bakedWhere.includes("Carlton") &&
      ord.custName === "Lucy's Coffee Shop";

    return fil;
  };
  */
  returnColumnsShelfProdsNorth = (delivDate, database) => {
    let shelfProds = makeOrders(today, database);
    console.log(shelfProds)
    shelfProds = getProdNickNames(delivDate, database, this.shelfProdsFilter)
    console.log(shelfProds)
    shelfProds = createColumns(shelfProds)
    console.log(shelfProds)
    return shelfProds;
  };
  /*
  returnColumnsCarltonToPrado = (database) => {
    let shelfProds = makeOrders(today, database);
    shelfProds = getProdNickNames(shelfProds, this.shelfProdsFilter)
    shelfProds = createColumns(shelfProds)
    return shelfProds;
  };

  returnColumnsBaguettes = (database) => {
    let shelfProds = makeOrders(today, database);
    shelfProds = getProdNickNames(shelfProds, this.shelfProdsFilter)
    shelfProds = createColumns(shelfProds)
    return shelfProds;
  };

  returnColumnsOtherRustics = (database) => {
    let shelfProds = makeOrders(today, database);
    shelfProds = getProdNickNames(shelfProds, this.shelfProdsFilter)
    shelfProds = createColumns(shelfProds)
    return shelfProds;
  };

  returnColumnsRetailStuff = (database) => {
    let shelfProds = makeOrders(today, database);
    shelfProds = getProdNickNames(shelfProds, this.shelfProdsFilter)
    console.log(shelfProds)
    shelfProds = createColumns(shelfProds)
    console.log(shelfProds)
    return shelfProds;
  };

  returnColumnsEarlyDeliveries = (database) => {
    let shelfProds = makeOrders(today, database);
    shelfProds = getProdNickNames(shelfProds, this.shelfProdsFilter)
    shelfProds = createColumns(shelfProds)
    return shelfProds;
  };
  */
}
