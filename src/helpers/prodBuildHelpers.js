export const addProdAttr = (fullOrder, products) => {
  for (let order of fullOrder) {
    let ind =
      products[products.findIndex((prod) => prod.prodName === order.prodName)];
    order.forBake = ind.forBake;
    order.packSize = ind.packSize;
    order.currentStock = ind.currentStock;
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
    .map((ord) => ord.qty);
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
    .map((ord) => ord.currentStock);
  console.log(curr);
  if (curr.length > 0) {
    let currAcc = curr.reduce(addUp);
    make.needEarly -= currAcc;
    make.makeTotal -= currAcc;
  }
  if (make.needEarly<0){
      make.needEarly = 0;
      make.makeTotal = 0;
  }
};
