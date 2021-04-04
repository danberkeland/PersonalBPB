export const buildCustList = (fullOrder) => {
  let custList = fullOrder.filter(ord => ord['isWhole']===true)
  custList = custList.map((ord) => ord["custName"]);
  let custListSet = new Set(custList);
  let custListArray = Array.from(custListSet);
  return custListArray;
};

export const buildInvList = (custListArray, nextInv) => {
  let invList = custListArray.map((cust) => ({
    custName: cust,
    invNum: 0,
    orders: [],
  }));
  invList.forEach(
    (inv, index) => (inv.invNum = Number(nextInv) + Number(index))
  );
  return invList;
};

export const attachInvoiceOrders = (
  invList,
  fullOrder,
  products,
  altPricing,
  customers,
  zones, 
  invFilter
) => {
  for (let inv of invList) {
    let orderClip = fullOrder.filter(
      (ord) => ord["custName"] === inv["custName"]
    );
    for (let ord of orderClip) {
      let ratePull =
        products[
          products.findIndex((prod) => prod["prodName"] === ord["prodName"])
        ].wholePrice;
      for (let alt of altPricing) {
        if (
          alt["custName"] === ord["custName"] &&
          alt["prodName"] === ord["prodName"]
        ) {
          ratePull = alt["wholePrice"];
        }
      }
      let pushBit = {
        prodName: ord["prodName"],
        qty: Number(ord["qty"]),
        rate: ratePull,
      };
      if (pushBit.qty > 0) {
        inv.orders.push(pushBit);
      }
    }

    if (
      (!orderClip[0]["route"] || orderClip[0]["route"] === "deliv") &&
      orderClip.filter((ord) => Number(ord["qty"]) > 0).length > 0
    ) {
      let zone =
        customers[
          customers.findIndex(
            (cust) => cust["custName"] === orderClip[0]["custName"]
          )
        ]["zoneName"];
      let rate =
        zones[zones.findIndex((zn) => zn["zoneName"] === zone)].zoneFee;
      if (Number(rate) > 0) {
        inv.orders.push({
          prodName: "DELIVERY",
          qty: 1,
          rate: rate,
        });
      }
    }
  }

  invList = invList.filter(
    (inv) =>
      inv.orders.length > 0 &&
      customers[
        customers.findIndex((cust) => cust["custName"] === inv.custName)
      ]["invoicing"] === invFilter 

  );
  return invList;
};

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
