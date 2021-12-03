import {
  convertDatetoBPBDate,
  todayPlus,
  tomBasedOnDelivDate,
  TwodayBasedOnDelivDate,
  ThreedayBasedOnDelivDate,
} from "../../../helpers/dateTimeHelpers";


import {
  createColumns,
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../helpers/delivGridHelpers";

import { getFullOrders } from "../../../helpers/CartBuildingHelpers";

import {
  sortZtoADataByIndex,
  addTwoGrids,
  subtractGridFromGrid,
} from "../../../helpers/sortDataHelpers";

import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "../ByRoute/Parts/utils/utils";


const clonedeep = require("lodash.clonedeep");
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
          grd.routeArrive = rte.RouteArrive;
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
    new Set(fullOrder.filter((fu) => filter(fu)).map((fil) => fil.prodName))
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
    new Set(fullOrder.filter((fu) => filter(fu)).map((fil) => fil.custName))
  );
};

const getOrdersList = (delivDate, database) => {
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
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
            fullOrder.findIndex(
              (ord) => ord.prodName === prodFullName && ord.custName === cust
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

const addUp = (acc, val) => {
  return acc + val;
};

const convertFrozenAttrToPlainAttr = (data) => {
  try {
    for (let d of data){
      d.prod = d.prod.substring(2)
    }

  } catch {
    for (let d of data){
      d = d.substring(2)
    }
  }
  
  return data
}

export default class ComposeNorthList {
  returnNorthBreakDown = (delivDate, database) => {
    let croixNorth = this.returnCroixNorth(delivDate, database);
    let shelfProdsNorth = this.returnShelfProdsNorth(database);
    let pocketsNorth = this.returnPocketsNorth(database);
    let CarltonToPrado = this.returnCarltonToPrado(database);
    let Baguettes = this.returnBaguettes(database);
    let otherRustics = this.returnOtherRustics(database);
    let retailStuff = this.returnRetailStuff(database);
    let earlyDeliveries = this.returnEarlyDeliveries(database);
    let columnsShelfProdsNorth = this.returnColumnsShelfProdsNorth(
      delivDate,
      database
    );
    let columnsPocketsNorth = this.returnColumnsPocketsNorth(
      delivDate,
      database
    );
    let columnsCarltonToPrado = this.returnColumnsCarltonToPrado(
      delivDate,
      database
    );
    let columnsBaguettes = this.returnColumnsBaguettes(delivDate, database);
    let columnsOtherRustics = this.returnColumnsOtherRustics(
      delivDate,
      database
    );
    let columnsRetailStuff = this.returnColumnsRetailStuff(delivDate, database);
    let columnsEarlyDeliveries = this.returnColumnsEarlyDeliveries(
      delivDate,
      database
    );

    return {
      croixNorth: croixNorth,
      shelfProdsNorth: shelfProdsNorth,
      pocketsNorth: pocketsNorth,
      CarltonToPrado: CarltonToPrado,
      Baguettes: Baguettes,
      otherRustics: otherRustics,
      retailStuff: retailStuff,
      earlyDeliveries: earlyDeliveries,
      columnsShelfProdsNorth: columnsShelfProdsNorth,
      columnsPocketsNorth: columnsPocketsNorth,
      columnsCarltonToPrado: columnsCarltonToPrado,
      columnsBaguettes: columnsBaguettes,
      columnsOtherRustics: columnsOtherRustics,
      columnsRetailStuff: columnsRetailStuff,
      columnsEarlyDeliveries: columnsEarlyDeliveries,
    };
  };

  returnCroixNorth = (delivDate, database) => {
    // Create Frozens needed North { prod, qty }
    let currentFreezerNumbers = this.getCurrentFreezerNumbers(
      delivDate,
      database
    );
    let frozensLeavingCarlton = this.getFrozensLeavingCarlton(
      delivDate,
      database
    );
    
    let bakedTodayAtCarlton = this.getBakedTodayAtCarlton(delivDate, database);
    let currentFrozenNeed = addTwoGrids(frozensLeavingCarlton,bakedTodayAtCarlton)
    currentFrozenNeed = subtractGridFromGrid(currentFreezerNumbers,currentFrozenNeed)
    // currentFrozenNeed = adjustForPackSize(currentFrozenNeed)

    console.log("currentFreezerOrders", currentFreezerNumbers);
    console.log("frozensLeavingCarlton", frozensLeavingCarlton);
    console.log("bakedTodayAtCarlton", bakedTodayAtCarlton);
    console.log("currentFrozenNeed", currentFrozenNeed);

    /*
    // Create Baked needed North { prod, qty }
    let ordersPlacedAfterDeadline = getOrdersPlacedAfterDeadline(delivDate,database)
    let backPorchBakeryOrders = getBackPorchBakeryOrders(delivDate,database)
    let bpbExtraOrders = getBpbExtraOrders(delivDate, database)
    let bakedGoingNorth = createBakedGoingNorth(backPorchBakeryOrders,bpbExtraOrders,ordersPlacedAfterDeadline)

    // Combine Frozens and Baked { prod, bakedQty, frozenQty }
    let combo = combineTwoGrids(bakedGoingNorth,currentFrozenNeed, "bakedQty","frozenQty")

    return combo
    */
  };
  /*
  returnCroixNorth = (delivDate, database) => {
    const [products, customers, routes, standing, orders, d, dd, alt, QBInfo] =
      database;

    let todayOrders = orders.filter(
      (ord) =>
        (ord.route === "slopick" &&
          ord.delivDate === convertDatetoBPBDate(today) &&
          new Date(ord.updatedAt) > new Date(QBInfo[1].updatedAt) &&
          ord.isWhole === false) ||
        (ord.route === "atownpick" &&
          ord.delivDate === convertDatetoBPBDate(today) &&
          new Date(ord.updatedAt) > new Date(QBInfo[0].updatedAt) &&
          ord.isWhole === false)
    );

    console.log("orders", todayOrders);

    console.log("QB", QBInfo);
    let frozensOrdersList = getOrdersList(today, database);
    console.log("ordList", getOrdersList(today, database));
    let frozenToday = frozensOrdersList.filter((frz) =>
      this.frzNorthFilter(frz)
    );
    frozenToday = this.makeAddFrozenQty(frozenToday);

    let bakedOrdersList = getOrdersList(tomorrow, database);
    let bakedTomorrow = bakedOrdersList.filter((frz) =>
      this.tomBakeFilter(frz)
    );
    bakedTomorrow = this.makeAddQty(bakedTomorrow);

    let combogrid = this.combineGrids(frozenToday, bakedTomorrow);
    combogrid = this.subtractCurrentStock(products, combogrid);
    combogrid = this.adjustForPackSize(combogrid);

    for (let combo of combogrid) {
      console.log("combo", combo);
      combo.prodNick = combo.prodNick.substring(2);
      let BackPorchOrders = getOrdersList(today, database).filter(
        (ord) => ord.custName === "Back Porch Bakery"
      );
      let backporchbakery = BackPorchOrders.filter(
        (back) => back.prodNick === combo.prodNick
      )[0].qty;
      console.log("backporchbakery", backporchbakery);
      let BPBExtraOrders = getOrdersList(today, database).filter(
        (ord) => ord.custName === "BPB Extras"
      );
      let bpbextra = BPBExtraOrders.filter(
        (back) => back.prodNick === combo.prodNick
      )[0].qty;
      console.log("bpbextra", bpbextra);
      let minusQty = 0;
      for (let ord of todayOrders) {
        if (ord.prodNick === combo.prodNick) {
          minusQty = minusQty + ord.qty;
        }
      }
      let newRetail = backporchbakery - minusQty;
      let Nfactor = 1 - bpbextra / backporchbakery;
      let newNorth = Math.round(newRetail * Nfactor);
      let sendNorth = newNorth - backporchbakery / 2;
      combo.baked = sendNorth;
    }
    console.log("Combo", combogrid);
    for (let co of combogrid) {
      let ind = products.findIndex((pr) => pr.nickName === co.prodNick);
      co.forBake = products[ind].forBake;
    }

    console.log("Combo", combogrid);
    return combogrid;
  };

  */

  getCurrentFreezerNumbers = (delivDate, database) => {
    const products = database[0]

    // create Product List of tomorrow's croissant Bake at Carlton
    let bakedOrdersList = getOrdersList(
      tomBasedOnDelivDate(delivDate),
      database
    );
    bakedOrdersList = Array.from(
      new Set(
        bakedOrdersList
          .filter((frz) => this.NorthCroixBakeFilter(frz))
          .map((pr) => pr.forBake)
      )
    );

    // create Product List of frozen croissant deliveries leaving Carlton
    let frozenToday = getOrdersList(delivDate, database);
    frozenToday = Array.from(
      new Set(
        frozenToday
          .filter((frz) => this.frzNorthFilter(frz))
          .map((pr) => pr.forBake)
      )
    );

    // need to remove the 'fr' so that it matches bakedOrder attribute
    frozenToday = convertFrozenAttrToPlainAttr(frozenToday);

    // combine product lists
    frozenToday = frozenToday.concat(bakedOrdersList);

    // create array { prod, qty }
    let frozenArray = [];
    for (let fr of frozenToday) {
      let ind = products.findIndex((prod) => prod.forBake === fr);
      let qty = products[ind].freezerNorth;
      let prod = products[ind].nickName;
      let item = {
        prod: prod,
        qty: qty ? qty : 0,
      };
      frozenArray.push(item);
    }

    return frozenArray;
  };

  NorthCroixBakeFilter = (ord) => {
    return (
      ord.where.includes("Mixed") &&
      ord.packGroup === "baked pastries" &&
      ord.doughType === "Croissant" &&
      (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
    );
  };

  getFrozensLeavingCarlton = (delivDate, database) => {
    let frozenToday = getOrdersList(delivDate, database);
    frozenToday = Array.from(
      new Set(
        frozenToday
          .filter((frz) => this.frzNorthFilter(frz))
      )
    );
    frozenToday = this.makeAddFrozenQty(frozenToday);
    frozenToday = convertFrozenAttrToPlainAttr(frozenToday)
    return frozenToday;
  };

  frzNorthFilter = (ord) => {
    return (
      ord.packGroup === "frozen pastries" &&
      ord.doughType === "Croissant" &&
      (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
    );
  };

  makeAddFrozenQty = (frozenToday) => {
    let makeList = frozenToday.map((mk) => ({
      prod: mk.forBake,
      qty: 0
    }));

    for (let make of makeList) {
      let qtyAccToday = 0;
      let qtyToday = frozenToday
        .filter((frz) => make.prod === frz.forBake)
        .map((ord) => ord.qty);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }
      make.qty = qtyAccToday;
    }

    return makeList;
  };


  getBakedTodayAtCarlton = (delivDate,database) => {
    
    let bakedOrdersList = getOrdersList(delivDate, database);
    let bakedToday = bakedOrdersList.filter((frz) =>
      this.NorthCroixBakeFilter(frz)
    );
    bakedToday = this.makeAddQty(bakedToday);

    return bakedToday

  }

  makeAddQty = (bake) => {
    let makeList2 = Array.from(
      new Set(bake.map((prod) => prod.prodNick))
    ).map((mk) => ({
      prod: mk,
      qty: 0,
    }));
    for (let make of makeList2) {
      make.qty = 1;

      let qtyAccToday = 0;

      let qtyToday = bake
        .filter((frz) => make.prod === frz.prodNick)
        .map((ord) => ord.qty);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }
      make.qty = qtyAccToday;
    }
    return makeList2;
  };

  combineGrids = (obj1, obj2) => {
    let firstObject = clonedeep(obj1);
    let secondObject = clonedeep(obj2);
    for (let first of firstObject) {
      for (let sec of secondObject) {
        if (first.prodNick === sec.prodNick) {
          first.qty += sec.qty;
        }
      }
    }

    for (let sec of secondObject) {
      for (let first of firstObject) {
        if (sec.prodNick === first.prodNick) {
          sec.qty = first.qty;
          continue;
        }
      }
      sec.prodNick = "fr" + sec.prodNick;
    }

    return secondObject;
  };

  subtractCurrentStock = (products, grid) => {
    for (let gr of grid) {
      let short = gr.prodNick.substring(2);
      let subQty =
        products[products.findIndex((prod) => prod.nickName === short)]
          .freezerNorth;

      gr.qty -= subQty;
      if (gr.qty < 0) {
        gr.qty = 0;
      }
    }
    return grid;
  };

  adjustForPackSize = (grid) => {
    for (let gr of grid) {
      gr.qty = Math.ceil(gr.qty / 12) * 12;
    }
    return grid;
  };

  returnPocketsNorth = (database) => {
    let shelfProds = makeOrders(today, database, this.pocketsNorthFilter);
    return shelfProds;
  };

  pocketsNorthFilter = (ord) => {
    return (
      ord.where.includes("Mixed") &&
      ord.packGroup !== "baked pastries" &&
      ord.route === "Pick up Carlton"
    );
  };

  returnShelfProdsNorth = (database) => {
    let shelfProds = makeOrders(today, database, this.shelfProdsFilter);
    return shelfProds;
  };

  shelfProdsFilter = (ord) => {
    return (
      ord.where.includes("Prado") &&
      ord.packGroup !== "frozen pastries" &&
      (ord.routeDepart === "Carlton" || ord.route === "Pick up Carlton")
    );
  };

  returnCarltonToPrado = (database) => {
    let shelfProds = makeOrders(today, database, this.CarltonToPradoFilter);
    return shelfProds;
  };

  CarltonToPradoFilter = (ord) => {
    let fil =
      ord.delivDate === convertedToday && ord.route === "Carlton to Prado";

    return fil;
  };

  returnBaguettes = (database) => {
    let shelfProds = makeOrders(today, database, this.BaguettesFilter);
    return shelfProds;
  };

  BaguettesFilter = (ord) => {
    return (
      ord.prodName === "Baguette" &&
      ord.routeDepart !== "Carlton" &&
      ord.routeArrive !== "Carlton"
    );
  };

  returnOtherRustics = (database) => {
    let shelfProds = makeOrders(today, database, this.otherRusticsFilter);
    return shelfProds;
  };

  otherRusticsFilter = (ord) => {
    return (
      ord.prodName !== "Baguette" &&
      ord.packGroup !== "retail" &&
      ord.where.includes("Carlton") &&
      ord.routeDepart === "Prado" &&
      (ord.routeStart > 8 || ord.route === "Pick up SLO")
    );
  };

  returnRetailStuff = (database) => {
    let shelfProds = makeOrders(today, database, this.retailStuffFilter);
    return shelfProds;
  };

  retailStuffFilter = (ord) => {
    return ord.packGroup === "retail" && ord.routeDepart === "Prado";
  };

  returnEarlyDeliveries = (database) => {
    let shelfProds = makeOrders(tomorrow, database, this.earlyDeliveriesFilter);
    return shelfProds;
  };

  earlyDeliveriesFilter = (ord) => {
    return (
      ord.routeDepart === "Prado" &&
      ord.where.includes("Carlton") &&
      ord.routeStart < 8
    );
  };

  returnColumnsShelfProdsNorth = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.shelfProdsFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsPocketsNorth = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.pocketsNorthFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsCarltonToPrado = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.CarltonToPradoFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsBaguettes = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.BaguettesFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsOtherRustics = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.otherRusticsFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsRetailStuff = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      delivDate,
      database,
      this.retailStuffFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };

  returnColumnsEarlyDeliveries = (delivDate, database) => {
    let filteredOrders = getProdNickNames(
      tomorrow,
      database,
      this.earlyDeliveriesFilter
    );
    if (filteredOrders.length > 0) {
      return createColumns(filteredOrders);
    } else {
      return [];
    }
  };
}
