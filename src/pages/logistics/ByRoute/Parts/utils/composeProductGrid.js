

import { getFullOrders } from "../../../../../helpers/CartBuildingHelpers";
import {
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../../../helpers/delivGridHelpers";
import { sortZtoADataByIndex } from "../../../../../helpers/sortDataHelpers";
import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "./utils";



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
                grd["route"] = rte["routeName"];
              }
            }
          }
        }
        for (let grd of prodGrid) {
          if (grd.zone==="slopick" || grd.zone==="Prado Retail"){
            grd.route="Pick up SLO"
          }
          if (grd.zone==="atownpick" || grd.zone==="Carlton Retail"){
            grd.route="Pick up Carlton"
          }
          if (grd.route==="slopick" || grd.route==="Prado Retail"){
            grd.route="Pick up SLO"
          }
          if (grd.route==="atownpick" || grd.route==="Carlton Retail"){
            grd.route="Pick up Carlton"
          }
          if (grd.route==="deliv"){
            grd.route="NOT ASSIGNED"
          }
        }
    return prodGrid
}

const addAttr = () => {

}



export default class ComposeProductGrid {
  returnProdGrid = (database, delivDate) => {
    let prodGrid = this.getProdGrid(database, delivDate);
   
    // [freshProds, shelfProds] = handleFrenchConundrum(freshProds, shelfProds);

    return {
      prodGrid: prodGrid,     
    };
  };

  getProdGrid(database, delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let prodGrid = getFullOrders(delivDate, database);
    prodGrid = zerosDelivFilter(prodGrid, delivDate, database);
    prodGrid = buildGridOrderArray(prodGrid, database);
    prodGrid = addRoutes(delivDate, prodGrid, database);
    console.log(prodGrid)
    //prodGrid = addAttr(database, prodGrid);
    
    return prodGrid;
  }

  

  


}

