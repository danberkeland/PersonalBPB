
import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
import {
  addProdAttr,
  addQty
} from "./utils";



const makeProdGrid = (products, filt) => {
  let make = Array.from(
    new Set(products.filter((prod) => filt(prod)).map((prod) => prod.prodName))
  ).map((make) => ({
    prodName: make,
    qty: 0,
  }));
  return make;
};

const getProdGrid = (delivDate, database) => {
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};



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
    let prodGrid = makeProdGrid(products, this.prodGridFilter);
    let fullOrders = getProdGrid(delivDate, database);
    for (let ret of prodGrid) {
      addQty(ret, fullOrders);
    }
    return prodGrid;
  }

  prodGridFilter = (prod) => {
    let fil =
      prod
    return fil;
  };

  


}

