import React, { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { OrdersContext } from "../../../../dataContexts/OrdersContext";
import { CustomerContext } from "../../../../dataContexts/CustomerContext";
import { StandingContext } from "../../../../dataContexts/StandingContext";
import { ProductsContext } from "../../../../dataContexts/ProductsContext";

import {
  buildCartList,
  buildStandList,
} from "../../../../helpers/CartBuildingHelpers";

import {
  removeDoubles,
  zerosDelivFilter,
  filterForZoneService,
  buildGridOrderArray,
  buildProductArray,
  createColumns,
  createListOfCustomers,
  createQtyGrid,
} from "../../../../helpers/delivGridHelpers";

import { sortZtoADataByIndex } from "../../../../helpers/sortDataHelpers";

const { DateTime } = require("luxon");

const calcDayNum = (delivDate) => {
  let day = DateTime.fromSQL(delivDate);
  let dayNum = day.weekday;
  if (dayNum === 7) {
    dayNum = 0;
  }
  dayNum = dayNum + 1;
  return dayNum;
};

const routeRunsThatDay = (rte, dayNum) => {
  if (rte["RouteSched"].includes(dayNum.toString())) {
    return true;
  } else {
    return false;
  }
};

const productCanBeInPlace = (grd, routes, rte) => {
  if (
    grd["where"].includes("Mixed") ||
    grd["where"].includes(
      routes[
        routes.findIndex((route) => route["routeName"] === rte["routeName"])
      ]["RouteDepart"]
    )
  ) {
    return true;
  } else {
    if (productCanMakeIt(grd, routes, rte)){
      return true
    } else {
      return false
    }
  }
};

const productCanMakeIt = (grd, routes, rte) => {
  for (let testRte of routes) {
  
    if (
      grd["where"].includes(testRte["RouteDepart"]) &&
      testRte["RouteArrive"] === rte["RouteDepart"] &&
      Number(testRte["routeStart"] + testRte["routeTime"]) < Number(rte["routeStart"])
    ) {
      return true;
    }
  }

  return false;
};

const productReadyBeforeRouteStarts = (
  products,
  customers,
  routes,
  grd,
  rte
) => {
  if (
    products[
      products.findIndex((prod) => prod["prodName"] === grd["prodName"])
    ]["readyTime"] <
      routes[routes.findIndex((rt) => rt["routeName"] === rte["routeName"])][
        "routeStart"
      ] ||
    products[
      products.findIndex((prod) => prod["prodName"] === grd["prodName"])
    ]["readyTime"] >
      customers[
        customers.findIndex((cust) => cust["custName"] === grd["custName"])
      ]["latestFinalDeliv"]
  ) {
    return true;
  } else {
    return false;
  }
};

const customerIsOpen = (customers, grd, routes, rte) => {
  if (
    customers[
      customers.findIndex((cust) => cust["custName"] === grd["custName"])
    ]["latestFirstDeliv"] <
    (Number(routes[routes.findIndex((rt) => rt["routeName"] === rte["routeName"])][
      "routeStart"
    ]) + Number(routes[routes.findIndex((rt) => rt["routeName"] === rte["routeName"])][
      "routeTime"
    ]))
  ) {
    return true;
  } else {
    return false;
  }
};

const RouteGrid = ({ routes }) => {
  const { orders } = useContext(OrdersContext);
  const { customers } = useContext(CustomerContext);
  const { standing } = useContext(StandingContext);
  const { products } = useContext(ProductsContext);
  const { delivDate, route } = useContext(CurrentDataContext);

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const constructGridInfo = () => {
    let cartList = buildCartList("*", delivDate, orders);
    let standList = buildStandList("*", delivDate, standing);

    let orderList = cartList.concat(standList);

    orderList = removeDoubles(orderList);
    let noZeroDelivDateOrderList = zerosDelivFilter(
      orderList,
      delivDate,
      customers
    );
    let filterServe = filterForZoneService(
      noZeroDelivDateOrderList,
      route,
      routes
    );

    if (!filterServe) {
      return [];
    }

    let gridOrderArray = buildGridOrderArray(filterServe, products);

    sortZtoADataByIndex(routes, "routeStart");
    for (let rte of routes) {
      for (let grd of gridOrderArray) {
        let dayNum = calcDayNum(delivDate);

        if (!rte["RouteServe"].includes(grd["zone"])) {
          continue;
        } else {
          if (
            routeRunsThatDay(rte, dayNum) &&
            productCanBeInPlace(grd, routes, rte) &&
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

    return gridOrderArray;
  };

  const constructColumns = () => {
    let gridToEdit = constructGridInfo();
    gridToEdit = gridToEdit.filter((grd) => grd["route"] === route);
    let listOfProducts = buildProductArray(gridToEdit, products);

    let columns = createColumns(listOfProducts);
    return columns;
  };

  const constructData = () => {
    let gridToEdit = constructGridInfo();
    let orderList = gridToEdit.filter((order) => order["route"] === route);
    let listOfCustomers = createListOfCustomers(orderList, route);
    let qtyGrid = createQtyGrid(listOfCustomers, orderList);
    return qtyGrid;
  };

  useEffect(() => {
    let col = constructColumns();
    let dat = constructData();
    setColumns(col ? col : []);
    setData(dat ? dat : []);
  }, [delivDate, route]);

  const dynamicColumns = columns.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  return (
    <div>
      <div className="card">
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={data}
          resizableColumns
          columnResizeMode="fit"
        >
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
};

export default RouteGrid;
