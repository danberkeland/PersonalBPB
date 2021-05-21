import {
    todayPlus,
  } from "../../../helpers/dateTimeHelpers";
  import {
    createColumns,
    zerosDelivFilter,
    buildGridOrderArray,
  } from "../../../helpers/delivGridHelpers";
  
  import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
  
  import { sortZtoADataByIndex } from "../../../helpers/sortDataHelpers";
  import {
    calcDayNum,
    routeRunsThatDay,
    productCanBeInPlace,
    productReadyBeforeRouteStarts,
    customerIsOpen,
  } from "../ByRoute/Parts/utils/utils";
 
  let today = todayPlus()[0];
  
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
  
  const getProdNickNames = (delivDate, database, filt) => {
    const [products, customers, routes, standing, orders] = database;
    let fullOrder = getFullOrders(delivDate, database);
    fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
    fullOrder = buildGridOrderArray(fullOrder, database);
    fullOrder = addRoutes(delivDate, fullOrder, database);
  
    let fullNames = Array.from(
      new Set(fullOrder.filter((fu) => filt(fu)).map((fil) => fil.prodName))
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
  
 
  export default class ComposeAMPastry {
    returnAMPastryBreakDown = (delivDate, database) => {
      let AMPastry = this.returnAMPastry(database);
      
      let columnsAMPastry = this.returnColumnsAMPastry(
        delivDate,
        database
      );
  
      // [freshProds, shelfProds] = handleFrenchConundrum(freshProds, shelfProds);
  
      return {
        AMPastry: AMPastry,
        columnsAMPastry: columnsAMPastry,
      };
    };
  
    
  
    
    returnAMPastry = (database) => {
      let shelfProds = makeOrders(today, database, this.AMPastryFilter);
      return shelfProds;
    };
  
    AMPastryFilter = (ord) => {
      return (
        (ord.where.includes("Mixed") || ord.where.includes("Prado")) &&
        ord.packGroup === "baked pastries" &&
        ord.routeDepart === "Prado"
      );
    };
  
    returnColumnsAMPastry = (delivDate, database) => {
      let filteredOrders = getProdNickNames(
        delivDate,
        database,
        this.AMPastryFilter
      );
      if (filteredOrders.length > 0) {
        return createColumns(filteredOrders);
      } else {
        return [];
      }
    };

  }
  