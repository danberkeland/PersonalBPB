import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../helpers/dateTimeHelpers";
import { createColumns } from "../../../helpers/delivGridHelpers";

import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
import {
  addProdAttr,
  addCroixBakedAndFrozen
} from "./utils";


let tomorrow = todayPlus()[1];
let today = todayPlus()[0];
let convertedToday = convertDatetoBPBDate(today)
let convertedTomorrow = convertDatetoBPBDate(tomorrow)

const getProdNickNames = (database, filter) => {
  const [products, customers, routes, standing, orders] = database;
  let fullOrderToday = getFullOrders(today, database);
  let fullOrder = addProdAttr(fullOrderToday, database); // adds forBake, packSize, currentStock
  let fullNames = Array.from(
    new Set(
      fullOrder
        .filter(
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

const getCustNames = (database, filter) => {
  
  const [products, customers, routes, standing, orders] = database;
  let fullOrderToday = getFullOrders(today, database);
  let fullOrder = addProdAttr(fullOrderToday, database); // adds forBake, packSize, currentStock
  
  return Array.from(
    new Set(
      fullOrder
        .filter(
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


const makeOrders = (database, filter) => {
 
  const [products, customers, routes, standing, orders] = database;
  let prodNames = getProdNickNames(database, filter);
  let custNames = getCustNames(database, filter);
  let fullOrderToday = getFullOrders(today, database);
  let fullOrder = addProdAttr(fullOrderToday, database); // adds forBake, packSize, currentStock
  
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
        custItem[prod] = 0;
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
    let CarltonToPrado = this.returnCarltonToPrado(database);
    let Baguettes = this.returnBaguettes(database);
    let otherRustics = this.returnOtherRustics(database);
    let retailStuff = this.returnRetailStuff(database)
    let earlyDeliveries = this.returnEarlyDeliveries(database);
    let columnsShelfProdsNorth = this.returnColumnsShelfProdsNorth(database);
    let columnsCarltonToPrado = this.returnColumnsCarltonToPrado(database);
    let columnsBaguettes = this.returnColumnsBaguettes(database);
    let columnsOtherRustics = this.returnColumnsOtherRustics(database);
    let columnsRetailStuff = this.returnColumnsRetailStuff(database);
    let columnsEarlyDeliveries = this.returnColumnsEarlyDeliveries(database);
  
    // [freshProds, shelfProds] = handleFrenchConundrum(freshProds, shelfProds);

    return {
      croixNorth: croixNorth,  
      shelfProdsNorth: shelfProdsNorth,
      CarltonToPrado: CarltonToPrado,
      Baguettes: Baguettes,
      otherRustics: otherRustics,
      retailStuff: retailStuff,
      earlyDeliveries: earlyDeliveries,
      columnsShelfProdsNorth: columnsShelfProdsNorth,
      columnsCarltonToPrado: columnsCarltonToPrado,
      columnsBaguettes: columnsBaguettes,
      columnsOtherRustics: columnsOtherRustics,
      columnsRetailStuff: columnsRetailStuff,
      columnsEarlyDeliveries: columnsEarlyDeliveries
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
  }

  croixNorthFilter = (prod) => {
    let fil =
      (prod.doughType === "Croissant" &&
      prod.packGroup === "baked pastries")

    return fil;
  };

  returnShelfProdsNorth = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let shelfProds = makeOrders(database, this.shelfProdsFilter);
    return shelfProds;
  };

  shelfProdsFilter = (ord) => {
    let fil =(
      ord.bakedWhere.includes("Prado") &&
      ord.packGroup !== "frozen pastries" &&
      ord.delivDate === convertedToday && 
      (ord.atownPick === true || ord.routeDepart==="Carlton")
      )
      
    return fil;
  };

  returnCarltonToPrado = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let CarltonToPrado = makeOrders(database, this.CarltonToPradoFilter);
    return CarltonToPrado;
  };

  CarltonToPradoFilter = (ord) => {
    let fil =(
      ord.delivDate === convertedToday &&
      ord.route === "Carlton to Prado"
      )
      
    return fil;
  };

  

  

  returnBaguettes = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let Baguettes = makeOrders(database, this.BaguettesFilter);
    return Baguettes;
  };

  BaguettesFilter = (ord) => {
    let fil =(
      ord.prodName === "Baguette" &&
      ord.delivDate === convertedToday &&
      ord.atownPick !== true && ord.routeDepart !== "Carlton"
      )
      
    return fil;
  };

  
  returnOtherRustics = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let otherRustics = makeOrders(database, this.otherRusticsFilter);
    return otherRustics;
  };

  otherRusticsFilter = (ord) => {
    let fil =(
      ord.bakedWhere.includes("Carlton") &&
      ord.custName !== "Lucy's Coffee Shop" &&
      ord.prodName !== "Baguette" &&
      ord.delivDate === convertedToday &&
      ord.atownPick !== true && ord.routeDepart !== "Carlton"
      )
      
    return fil;
  };
  

  returnRetailStuff = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let retailStuff = makeOrders(database, this.retailStuffFilter);
    return retailStuff;
  };

  retailStuffFilter = (ord) => {
    let fil =(
      ord.bakedWhere.includes("Carlton") &&
      ord.packGroup === "retail" &&
      ord.delivDate === convertedToday &&
      ord.atownPick !== true && ord.routeDepart !== "Carlton"
      )
      
    return fil;
  };

  

  returnEarlyDeliveries = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let earlyDeliveries = makeOrders(database, this.earlyDeliveriesFilter);
    return earlyDeliveries;
  };

  earlyDeliveriesFilter = (ord) => {
    let fil =(
      
      ord.custName === "Lucy's Coffee Shop"
      )
      
    return fil;
  };

  
  

  returnColumnsShelfProdsNorth = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let filteredOrders = getProdNickNames(database, this.shelfProdsFilter);
    filteredOrders = createColumns(filteredOrders);
    return filteredOrders;
  };

  

  returnColumnsCarltonToPrado = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let filteredOrders = getProdNickNames(database, this.CarltonToPradoFilter);
    filteredOrders = createColumns(filteredOrders);
    return filteredOrders;
  };

  

  returnColumnsBaguettes = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let filteredOrders = getProdNickNames(database, this.BaguettesFilter);
    filteredOrders = createColumns(filteredOrders);
    return filteredOrders;
  };

  

  returnColumnsOtherRustics = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let filteredOrders = getProdNickNames(database, this.otherRusticsFilter);
    filteredOrders = createColumns(filteredOrders);
    return filteredOrders;
  };

  

  returnColumnsRetailStuff = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let filteredOrders = getProdNickNames(database, this.retailStuffFilter);
    filteredOrders = createColumns(filteredOrders);
    return filteredOrders;
  };

 

  returnColumnsEarlyDeliveries = (database) => {
    const [products, customers, routes, standing, orders] = database;
    let filteredOrders = getProdNickNames(database, this.earlyDeliveriesFilter);
    filteredOrders = createColumns(filteredOrders);
    return filteredOrders;
  };

  



  

  


}

