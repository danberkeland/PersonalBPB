import { todayPlus } from "../../../helpers/dateTimeHelpers";
import {
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../helpers/delivGridHelpers";

import { getFullOrders, getFullProdOrders } from "../../../helpers/CartBuildingHelpers";

import { sortZtoADataByIndex } from "../../../helpers/sortDataHelpers";
import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "../../logistics/ByRoute/Parts/utils/utils";

let today = todayPlus()[0]
let tomorrow = todayPlus()[1]
let twoDay = todayPlus()[2]

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

const getOrdersList = (delivDate, database,prod) => {
  let fullOrder
  if (prod===true){
    
  fullOrder = getFullProdOrders(delivDate, database);
  } else {
    fullOrder = getFullOrders(delivDate, database);
  }
  console.log(fullOrder)
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
  return fullOrder;
};

export default class ComposeAllOrders {
  returnAllOrdersBreakDown = (delivDate, database, loc, prod) => {
    let allOrders = this.returnAllOrders(delivDate, database, loc, prod);
    let whoBake = this.returnWhoBake(delivDate, database, loc, prod);
    let whoShape = this.returnWhoShape(delivDate, database, loc, prod);

    return {
      allOrders: allOrders,
      whoBake: whoBake,
      whoShape: whoShape
    };
  };

  returnAllOrders = (delivDate, database, loc, prod) => {
    const [products, customers, routes, standing, orders] = database;
    let allOrdersList = getOrdersList(delivDate, database, prod);
    
    let allOrdersToday = allOrdersList.filter((set) =>
      this.allOrdersFilter(set, loc)
    );
    
    for (let ord of allOrdersToday){
      ord.qty = ord.qty*ord.packSize
    }
    return allOrdersToday;
  };

  allOrdersFilter = (ord, loc) => {
    return (
      (ord.packGroup === "rustic breads" || (ord.packGroup === "retail" && ord.where.includes(loc))) ||
      (ord.routeDepart === "Carlton" &&
        ord.packGroup === "baked pastries" &&
        ord.doughType !== "Croissant") || 
        ord.doughType === "Ciabatta"
      
    );
  };

  returnWhoBake = (delivDate, database, loc, prod) => {
    const [products, customers, routes, standing, orders] = database;
    let whoBakeTodayList = getOrdersList(today, database, prod);
    
    let whoBakeToday = whoBakeTodayList.filter((set) =>
      this.whoBakeTodayFilter(set, loc)
    );

    let whoBakeTomorrowList = getOrdersList(tomorrow, database, prod);
    
    let whoBakeTomorrow = whoBakeTomorrowList.filter((set) =>
      this.whoBakeTomorrowFilter(set, loc)
    );
    
    let whoBakeAll = whoBakeToday.concat(whoBakeTomorrow)

    for (let ord of whoBakeAll){
      ord.qty = ord.qty*ord.packSize
    }
    return whoBakeAll;
  };

  whoBakeTodayFilter = (ord, loc) => {
    return (
      
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
      ((ord.routeStart >= 8 && ord.routeDepart === "Prado") ||
        ord.routeDepart === "Carlton" ||
        ord.zone === "Prado Retail" ||
        ord.zone === "slopick")
    );
  };

 

  whoBakeTomorrowFilter = (ord, loc) => {
    return (
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
      ((ord.routeStart < 8 && ord.routeDepart === "Prado") &&
        ord.zone !== "Prado Retail" &&
        ord.zone !== "slopick")
      
    );
  };

  returnWhoShape = (delivDate, database, loc, prod) => {
    const [products, customers, routes, standing, orders] = database;
    let whoShapeTodayList = getOrdersList(tomorrow, database, prod);
    
    let whoShapeToday = whoShapeTodayList.filter((set) =>
      this.whoShapeTodayFilter(set, loc)
    );

    let whoShapeTomorrowList = getOrdersList(twoDay, database, prod);
    
    let whoShapeTomorrow = whoShapeTomorrowList.filter((set) =>
      this.whoShapeTomorrowFilter(set, loc)
    );
    
    let whoShapeAll = whoShapeToday.concat(whoShapeTomorrow)

    for (let ord of whoShapeAll){
      ord.qty = ord.qty*ord.packSize
    }
    return whoShapeAll;
  };

  whoShapeTodayFilter = (ord, loc) => {
    return (
      
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
      ((ord.routeStart >= 8 && ord.routeDepart === "Prado") ||
        ord.routeDepart === "Carlton" ||
        ord.zone === "Prado Retail" ||
        ord.zone === "slopick")
    );
  };

 

  whoShapeTomorrowFilter = (ord, loc) => {
    return (
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
      ((ord.routeStart < 8 && ord.routeDepart === "Prado") &&
        ord.zone !== "Prado Retail" &&
        ord.zone !== "slopick")
      
    );
  };
}
