import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../helpers/dateTimeHelpers";
import { createColumns } from "../../../helpers/delivGridHelpers";

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];

const getProdNickNames = (database, loc) => {
  const [products, customers, routes, standing, orders] = database;
  let fullNames = Array.from(
    new Set(
      orders
        .filter(
          (ord) =>
            !customers.map((cust) => cust.custName).includes(ord.custName) &&
            ord.delivDate === convertDatetoBPBDate(today) &&
            ord.route === loc
        )
        .map((fil) => fil.prodName)
    )
  );
  let nickNames = fullNames.map(
    (fil) =>
      products[products.findIndex((prod) => fil === prod.prodName)].nickName
  );
  return nickNames;
};

const getCustNames = (database, loc) => {
  const [products, customers, routes, standing, orders] = database;
  return Array.from(
    new Set(
      orders
        .filter(
          (ord) =>
            !customers.map((cust) => cust.custName).includes(ord.custName) &&
            ord.delivDate === convertDatetoBPBDate(today) &&
            ord.route === loc
        )
        .map((fil) => fil.custName)
    )
  );
};

const makeSpecialColumns = (database, loc) => {
  const [products, customers, routes, standing, orders] = database;
  let filteredOrders = getProdNickNames(database, loc);
  filteredOrders = createColumns(filteredOrders);
  return filteredOrders;
};

const makeSpecialOrders = (database, loc) => {
  const [products, customers, routes, standing, orders] = database;
  let prodNames = getProdNickNames(database, loc);
  let custNames = getCustNames(database, loc);
  console.log(custNames);
  let orderArray = [];
  for (let cust of custNames) {
    let custItem = {};
    custItem = {
      customer: cust,
    };
    for (let prod of prodNames) {
      let prodFullName =
        products[products.findIndex((pr) => pr.nickName === prod)].prodName;
      console.log(prodFullName);
      try {
        custItem[prod] =
          orders[
            orders.findIndex(
              (ord) =>
                ord.custName === cust &&
                ord.prodName === prodFullName &&
                ord.delivDate === convertDatetoBPBDate(today) &&
                ord.route === loc
            )
          ].qty;
      } catch {
        custItem[prod] = 0;
      }
    }
    orderArray.push(custItem);
  }
  return orderArray;
};

export default class ComposeSpecialOrders {
  returnSpecialNorthColumns = (database) => {
    let columns = this.getSpecialNorthColumns(database);
    return {
      columns: columns,
    };
  };

  getSpecialNorthColumns(database) {
    let specialNorthColumns = makeSpecialColumns(database, "atownpick");
    return specialNorthColumns;
  }

  returnSpecialSouthColumns = (database) => {
    let columns = this.getSpecialSouthColumns(database);
    return {
      columns: columns,
    };
  };

  getSpecialSouthColumns(database) {
    let specialSouthColumns = makeSpecialColumns(database, "slopick");
    return specialSouthColumns;
  }

  returnBPBNSpecialOrders = (database) => {
    let specialOrders = this.getBPBNSpecialOrders(database);
    return {
      specialOrders: specialOrders,
    };
  };

  getBPBNSpecialOrders(database) {
    const [products, customers, routes, standing, orders] = database;
    let BPBNSpecialOrders = makeSpecialOrders(database, "atownpick");
    return BPBNSpecialOrders;
  }

  returnBPBSSpecialOrders = (database) => {
    let specialOrders = this.getBPBSSpecialOrders(database);
    return {
      specialOrders: specialOrders,
    };
  };

  getBPBSSpecialOrders(database) {
    const [products, customers, routes, standing, orders] = database;
    let BPBSSpecialOrders = makeSpecialOrders(database, "slopick");
    return BPBSSpecialOrders;
  }
}
