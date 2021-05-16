import { todayPlus } from "../../../helpers/dateTimeHelpers";
import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
import { addProdAttr, addSetOut } from "./utils";

let tomorrow = todayPlus()[1];
let twoDay = todayPlus()[2];

const getFullMakeOrders = (delivDate, database) => {
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};


const buildSetOutTemplate = (products, filt, loc) => {
  let makeFreshProds;
  makeFreshProds = Array.from(
    new Set(
      products
          .filter((prod) => filt(prod,loc))
        .map((prod) => prod.forBake)
    )
  ).map((make) => ({
    forBake: make,
    qty: 0
  }));

  return makeFreshProds;
};

export default class ComposeSetOut {
  returnSetOutBreakDown = (database, loc) => {
    let setOut = this.getSetOut(database, loc);
    let pastryPrep = this.getPastryPrep(database, loc)

    // setOut = handleAlmondConundrum(setOut, database, loc);


    return {
      setOut: setOut,
      pastryPrep: pastryPrep,
    };
  };

  getSetOut(database, loc) {
    const [products, customers, routes, standing, orders] = database;
    let makeSetOut = buildSetOutTemplate(products, this.setOutFilter, loc);
    let fullOrdersTwoDay = getFullMakeOrders(twoDay, database);
    let fullOrdersTomorrow = getFullMakeOrders(tomorrow, database);
    for (let make of makeSetOut) {
      addSetOut(make, fullOrdersTwoDay, fullOrdersTomorrow, routes, loc);
    }
    return makeSetOut;
  }

  getPastryPrep(database, loc) {
    const [products, customers, routes, standing, orders] = database;
    let makeSetOut = buildSetOutTemplate(products, this.pastryPrepFilter, loc);
    let fullOrdersTwoDay = getFullMakeOrders(twoDay, database);
    let fullOrdersTomorrow = getFullMakeOrders(tomorrow, database);
    for (let make of makeSetOut) {
      addSetOut(make, fullOrdersTwoDay, fullOrdersTomorrow, routes, loc);
    }
    return makeSetOut;
  }

  setOutFilter = (prod,loc) => {
    let fil =
    (prod.bakedWhere.includes(loc) ||
              prod.bakedWhere.includes("Mixed")) &&      
              prod.packGroup === "baked pastries" &&
              prod.doughType === "Croissant"
    return fil;
  };

  pastryPrepFilter = (prod,loc) => {
    let fil =
    (prod.bakedWhere.includes(loc) ||
              prod.bakedWhere.includes("Mixed")) &&      
              prod.packGroup === "baked pastries" &&
              prod.doughType !== "Croissant"
    return fil;
  };
}
