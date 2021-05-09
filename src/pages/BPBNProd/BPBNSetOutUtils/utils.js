const clonedeep = require("lodash.clonedeep");

export const addProdAttr = (fullOrder, database) => {
  const [products, customers, routes, standing, orders] = database;
  let fullToFix = clonedeep(fullOrder);

  fullToFix = fullToFix.map((full) => ({
    custName: full.custName,
    delivDate: full.delivDate,
    prodName: full.prodName,
    qty: full.qty,
  }));
  fullToFix.forEach((full) =>
    Object.assign(full, update(full, products, customers))
  );

  return fullToFix;
};

export const addSetOut = (
  make,
  fullTwoDay,
  fullOrdersTomorrow,
  routes,
  loc
) => {
  make.qty = 0;

  let qtyAccTomorrow = 0;

  let availableRoutes = routes.filter((rt) => rt.RouteDepart === loc);

  let qtyTomorrow = fullOrdersTomorrow
    .filter(
      (full) =>
        make.forBake === full.forBake &&
        checkZone(full, availableRoutes) === true
    )
    .map((ord) => ord.qty);
  if (qtyTomorrow.length > 0) {
    qtyAccTomorrow = qtyTomorrow.reduce(addUp);

    make.qty = qtyAccTomorrow;
  }
};

const addUp = (acc, val) => {
  return acc + val;
};

const checkZone = (full, availableRoutes) => {
  for (let av of availableRoutes) {
    if (av.RouteServe.includes(full.zone)) {
      return true;
    }
  }
  return false;
};

const update = (order, products, customers) => {
    let atownPick = "atownpick";
    let ind =
      products[products.findIndex((prod) => prod.prodName === order.prodName)];
    try {
      let custInd =
        customers[
          customers.findIndex((cust) => cust.custName === order.custName)
        ];
      atownPick = custInd.zoneName;
    } catch {
      atownPick = "atownpick";
    }
  
    let pick = false;
    if (atownPick === "atownpick" || atownPick === "Carlton Retail") {
      pick = true;
    }
  
    let toAdd = {
      forBake: ind.forBake,
      packSize: ind.packSize,
      currentStock: ind.currentStock,
      batchSize: ind.batchSize,
      bakeExtra: ind.bakeExtra,
      readyTime: ind.readyTime,
      zone: atownPick,
      atownPick: pick,
    };
  
    return toAdd;
  };
  
