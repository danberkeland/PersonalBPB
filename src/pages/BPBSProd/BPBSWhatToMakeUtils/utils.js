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

export const addFresh = (
  make,
  fullOrders,
  fullOrdersTomorrow,
  products,
  routes
) => {
  make.qty = 0;

  let qtyAccToday = 0;
  let qtyAccTomorrow = 0;
  let guaranteeTimeToday = Number(
    products[products.findIndex((prod) => prod.forBake === make.forBake)]
      .readyTime
  );
  let availableRoutesToday = routes.filter(
    (rt) =>
      (rt.RouteDepart === "Prado") &
        (Number(rt.routeStart) > guaranteeTimeToday) ||
      rt.routeName === "Pick up SLO"
  );
  let availableRoutesTomorrow = routes.filter(
    (rt) => rt.RouteDepart === "Carlton"
  );

  let qtyToday = fullOrders
    .filter(
      (full) =>
        make.forBake === full.forBake &&
        full.atownPick !== true &&
        checkZone(full, availableRoutesToday) === true
    )
    .map((ord) => ord.qty * ord.packSize);

  if (qtyToday.length > 0) {
    qtyAccToday = qtyToday.reduce(addUp);
  }

  let qtyTomorrow = fullOrdersTomorrow
    .filter(
      (full) =>
        make.forBake === full.forBake &&
        full.atownPick !== true &&
        checkZone(full, availableRoutesTomorrow) === true
    )
    .map((ord) => ord.qty * ord.packSize);

  if (qtyTomorrow.length > 0) {
    qtyAccTomorrow = qtyTomorrow.reduce(addUp);
  }

  make.qty = qtyAccToday;
  make.makeTotal = qtyAccToday + qtyAccTomorrow;
  make.bagEOD = qtyAccTomorrow;
};

export const addNeedEarly = (make, products) => {
  let curr = products
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.currentStock * ord.packSize);

  if (curr.length > 0) {
    let currAcc = curr.reduce(addUp);
    make.needEarly -= currAcc;
    make.makeTotal -= currAcc;
  }
  if (make.needEarly < 0) {
    make.needEarly = 0;
  }
  if (make.makeTotal < 0) {
    make.makeTotal = 0;
  }
  let batchSize =
    products[products.findIndex((prod) => prod.forBake === make.forBake)]
      .batchSize;

  if (batchSize > 0) {
    let num = Math.ceil(Number(make.makeTotal) / Number(batchSize));
    make.makeTotal = num * Number(batchSize);
  }
};

export const addShelf = (
  make,
  fullOrders,
  fullOrdersTomorrow,
  products,
  routes
) => {
  make.qty = 0;
  make.needEarly = 0;

  let qtyAccToday = 0;
  let qtyAccTomorrow = 0;

  let qtyToday = fullOrders
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.qty * ord.packSize);
  if (qtyToday.length > 0) {
    qtyAccToday = qtyToday.reduce(addUp);
  }
  let qtyTomorrow = fullOrdersTomorrow
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.qty * ord.packSize);

  if (qtyTomorrow.length > 0) {
    qtyAccTomorrow = qtyTomorrow.reduce(addUp);
  }

  make.qty = qtyAccToday;
  make.needEarly = qtyAccToday;
  make.makeTotal = qtyAccTomorrow + qtyAccToday;
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

const freshProdFilter = (prod) => {
  let fil =
    !prod.bakedWhere.includes("Carlton") &&
    Number(prod.readyTime) < 15 &&
    prod.packGroup !== "frozen pastries" &&
    prod.packGroup !== "baked pastries";
  return fil;
};

const makeProds = (products, filt) => {
  let make = Array.from(
    new Set(products.filter((prod) => filt(prod)).map((prod) => prod.forBake))
  ).map((make) => ({
    forBake: make,
    qty: 0,
    makeTotal: 0,
    bagEOD: 0,
  }));
  return make;
};

export const buildMakeFreshProdTemplate = (products) => {
  let makeFreshProds;
  makeFreshProds = makeProds(products, freshProdFilter);

  return makeFreshProds;
};

const addUp = (acc, val) => {
  return acc + val;
};

export const addDelivQty = (make, fullOrders) => {
  make.qty = 0;
  make.needEarly = 0;
  let qty = fullOrders
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.qty * ord.packSize);
  if (qty.length > 0) {
    let qtyAcc = qty.reduce(addUp);
    make.qty = qtyAcc;
    make.needEarly = qtyAcc;
    make.makeTotal = qtyAcc;
  }
};

const checkZone = (full, availableRoutes) => {
  for (let av of availableRoutes) {
    if (av.RouteServe.includes(full.zone)) {
      return true;
    }
  }
  return false;
};

export const addPocketsQty = (make, fullOrders) => {
  console.log(make)
  
  make.qty = 0;
  make.needEarly = 0;
  let qty = fullOrders
    .filter((full) => make.forBake === full.forBake && full.atownPick === true)
    .map((ord) => ord.qty * ord.packSize);
  if (qty.length > 0) {
    let qtyAcc = qty.reduce(addUp);
    make.qty = qtyAcc;
    make.needEarly = qtyAcc;
    make.makeTotal = qtyAcc;
  }
};
