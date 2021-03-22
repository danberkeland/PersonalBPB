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

import { sortAtoZDataByIndex } from "../../../../helpers/sortDataHelpers";

const { DateTime } = require("luxon");

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

    sortAtoZDataByIndex(routes, "routeStart");
    for (let rte of routes) {
      for (let grd of gridOrderArray) {
        let day = DateTime.fromSQL(delivDate);
        let dayNum = day.weekday;
        if (dayNum === 7) {
          dayNum = 0;
        }
        dayNum = dayNum + 1;

        if (!rte["RouteServe"].includes(grd["zone"])) {
          continue;
        } else {
          if (
            rte["RouteSched"].includes(dayNum.toString()) &&
            (grd["where"].includes("Mixed") ||
            grd["where"].includes(
              routes[
                routes.findIndex((route) => route["routeName"] === rte["routeName"])
              ]["RouteDepart"]
            )) &&
            (products[
              products.findIndex((prod) => prod["prodName"] === grd["prodName"])
            ]["readyTime"] <
              routes[
                routes.findIndex((rt) => rt["routeName"] === rte["routeName"])
              ]["routeStart"] ||
              products[
                products.findIndex(
                  (prod) => prod["prodName"] === grd["prodName"]
                )
              ]["readyTime"] >
                customers[
                  customers.findIndex(
                    (cust) => cust["custName"] === grd["custName"]
                  )
                ]["latestFinalDeliv"]) &&

              // Shop is open
              customers[
                customers.findIndex(
                  (cust) => cust["custName"] === grd["custName"]
                )
              ]["latestFirstDeliv"]>routes[
                routes.findIndex((rt) => rt["routeName"] === rte["routeName"])
              ]["routeStart"]
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
    gridToEdit = gridToEdit.filter(grd => grd["route"]===route)
    console.log(gridToEdit)
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
