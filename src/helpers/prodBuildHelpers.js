export const addProdAttr = (fullOrder, products, customers) => {
  for (let order of fullOrder) {
    let ind =
      products[products.findIndex((prod) => prod.prodName === order.prodName)];
    let custInd =
      customers[
        customers.findIndex((cust) => cust.custName === order.custName)
      ];

    order.forBake = ind.forBake;
    order.packSize = ind.packSize;
    order.currentStock = ind.currentStock;
    order.batchSize = ind.batchSize;
    order.bakeExtra = ind.bakeExtra;
    let atownPick = custInd.zoneName;

    if (atownPick === "atownpick" || atownPick === "Carlton Retail") {
      order.atownPick = true;
    } else {
      order.atownPick = false;
    }
  }

  return fullOrder;
};

export const buildMakeFreshProdTemplate = (products) => {
  let makeFreshProds;
  makeFreshProds = Array.from(
    new Set(
      products
        .filter(
          (prod) =>
            !prod.bakedWhere.includes("Carlton") &&
            Number(prod.readyTime) < 15 &&
            prod.packGroup !== "frozen pastries" &&
            prod.packGroup !== "baked pastries"
        )
        .map((prod) => prod.forBake)
    )
  ).map((make) => ({
    forBake: make,
    qty: 0,
    needEarly: 0,
    makeTotal: 0,
  }));

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

export const addFreshQty = (make, fullOrders) => {
  make.qty = 0;
  make.needEarly = 0;
  let qty = fullOrders
    .filter((full) => make.forBake === full.forBake && full.atownPick !== true)
    .map((ord) => ord.qty * ord.packSize);
  if (qty.length > 0) {
    let qtyAcc = qty.reduce(addUp);
    make.qty = qtyAcc;
    make.needEarly = qtyAcc;
    make.makeTotal = qtyAcc;
  }
};

export const addPocketsQty = (make, fullOrders) => {
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
    make.makeTotal = 0;
  }
  let batchSize =
    products[products.findIndex((prod) => prod.forBake === make.forBake)]
      .batchSize;

  if (batchSize > 0) {
    let num = Math.ceil(make.makeTotal / batchSize);
    make.makeTotal = num * batchSize;
  }
};

export const buildMakeShelfProdTemplate = (products) => {
  let makeShelfProds;
  makeShelfProds = Array.from(
    new Set(
      products
        .filter(
          (prod) =>
            !prod.bakedWhere.includes("Carlton") &&
            Number(prod.readyTime) >= 15 &&
            prod.packGroup !== "frozen pastries" &&
            prod.packGroup !== "baked pastries" &&
            prod.freezerThaw !== true
        )
        .map((prod) => prod.forBake)
    )
  ).map((make) => ({
    forBake: make,
    qty: 0,
    needEarly: 0,
    makeTotal: 0,
  }));

  return makeShelfProds;
};

export const buildMakeFreezerProdTemplate = (products) => {
  let makeShelfProds;
  makeShelfProds = Array.from(
    new Set(
      products
        .filter(
          (prod) =>
            !prod.bakedWhere.includes("Carlton") &&
            Number(prod.readyTime) >= 15 &&
            prod.packGroup !== "frozen pastries" &&
            prod.packGroup !== "baked pastries" &&
            prod.freezerThaw === true
        )
        .map((prod) => prod.forBake)
    )
  ).map((make) => ({
    forBake: make,
    qty: 0,
    needEarly: 0,
    makeTotal: 0,
  }));

  return makeShelfProds;
};

export const buildMakePocketsNorthTemplate = (products) => {
  let makeShelfProds;
  makeShelfProds = Array.from(
    new Set(
      products
        .filter(
          (prod) =>
            prod.bakedWhere.includes("Mixed") &&
            Number(prod.readyTime) < 15 &&
            prod.packGroup !== "frozen pastries" &&
            prod.packGroup !== "baked pastries" &&
            prod.freezerThaw !== true
        )
        .map((prod) => prod.forBake)
    )
  ).map((make) => ({
    forBake: make,
    qty: 0,
    needEarly: 0,
    makeTotal: 0,
  }));

  return makeShelfProds;
};
