  import { todayPlus } from "../../../helpers/dateTimeHelpers";
  import { getFullOrders } from "../../../helpers/CartBuildingHelpers"
  import { addProdAttr, addFresh, addNeedEarly, addShelf  } from "./utils"
  import { handleFrenchConundrum } from "./conundrums"

  let tomorrow = todayPlus()[1];
  let today = todayPlus()[0];
  
 const getFullMakeOrders = (delivDate, database) => {
   let fullOrder = getFullOrders(delivDate, database);
   fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
   return fullOrder;
 };
      
  const pocketsNorthFilter = (prod) => {
  let fil = prod.bakedWhere.includes("Mixed") &&
            Number(prod.readyTime) < 15 &&
            prod.packGroup !== "frozen pastries" &&
            prod.packGroup !== "baked pastries" &&
            prod.freezerThaw !== true
  return fil
  }

  const freshProdFilter = (prod) => {
  let fil = !prod.bakedWhere.includes("Carlton") &&
            Number(prod.readyTime) < 15 &&
            prod.packGroup !== "frozen pastries" &&
            prod.packGroup !== "baked pastries"
  return fil
  }

  const shelfProdsFilter = (prod) => {
  let fil = !prod.bakedWhere.includes("Carlton") &&
            Number(prod.readyTime) >= 15 &&
            prod.packGroup !== "frozen pastries" &&
            prod.packGroup !== "baked pastries" &&
            prod.freezerThaw !== true
  return fil
  }

  const freezerProdsFilter = (prod) => {
  let fil = !prod.bakedWhere.includes("Carlton") &&
            Number(prod.readyTime) >= 15 &&
            prod.packGroup !== "frozen pastries" &&
            prod.packGroup !== "baked pastries" &&
            prod.freezerThaw === true
  return fil
  }

  const makeProds = (products, filt) => {
    let make = Array.from(
      new Set(
        products
          .filter((prod) => filt(prod))
          .map((prod) => prod.forBake)
      )
    ).map((make) => ({
      forBake: make,
      qty: 0,
      makeTotal: 0,
      bagEOD: 0,
    }));
    return make
  }




export default class ComposeWhatToMake {

  returnMakeBreakDown = (database) => {
    let pocketsNorth = this.getPocketsNorth(database);
    let freshProds = this.getFreshProds(database);
    let shelfProds = this.getShelfProds(database);
    let freezerProds = this.getFreezerProds(database);

    [ freshProds, shelfProds ] = handleFrenchConundrum(freshProds, shelfProds)

    return {
      pocketsNorth: pocketsNorth,
      freshProds: freshProds,
      shelfProds: shelfProds,
      freezerProds: freezerProds,
    };
  };

  

  getPocketsNorth(database) {
    const [products, customers, routes, standing, orders] = database
    let makePocketsNorth = makeProds(products, pocketsNorthFilter);
    let fullOrdersToday = getFullMakeOrders(today, database)
    let fullOrdersTomorrow = getFullMakeOrders(tomorrow, database)
    for (let make of makePocketsNorth) {
      addFresh(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
    }
    return makePocketsNorth;
  }


  getFreshProds = (database) => {
    const [products, customers, routes, standing, orders] = database
    let makeFreshProds = makeProds(products, freshProdFilter);
    let fullOrdersToday = getFullMakeOrders(today, database)
    let fullOrdersTomorrow = getFullMakeOrders(tomorrow, database)
    for (let make of makeFreshProds) {
      addFresh(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
    }
    return makeFreshProds;
  }

  getShelfProds(database) {
    const [products, customers, routes, standing, orders] = database
    let makeShelfProds = makeProds(products, shelfProdsFilter);
    let fullOrdersToday = getFullMakeOrders(today, database)
    let fullOrdersTomorrow = getFullMakeOrders(tomorrow, database)
    for (let make of makeShelfProds) {
      addShelf(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
      addNeedEarly(make, products);
    }
    return makeShelfProds;
  }

  getFreezerProds(database) {
    const [products, customers, routes, standing, orders] = database
    let makeFreezerProds = makeProds(products, freezerProdsFilter);
    let fullOrdersToday = getFullMakeOrders(today, database)
    let fullOrdersTomorrow = getFullMakeOrders(tomorrow, database)
    for (let make of makeFreezerProds) {
      addShelf(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
      addNeedEarly(make, products);
    }
    return makeFreezerProds;
  }
}
