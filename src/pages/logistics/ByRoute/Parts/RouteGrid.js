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
  isZoneIncludedInRoute,
  buildProductArray,
  createColumns,
  createListOfCustomers,
  createQtyGrid,
} from "../../../../helpers/delivGridHelpers";

const clonedeep = require("lodash.clonedeep");

const RouteGrid = ({ routes }) => {
  const { orders } = useContext(OrdersContext);
  const { customers } = useContext(CustomerContext);
  const { standing } = useContext(StandingContext);
  const { products } = useContext(ProductsContext);
  const { delivDate, route, setRoute } = useContext(CurrentDataContext);

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


    // FINAL LOGIC STARTS HERE
    // Route for Route in reverse - if order zone is included in route
    gridOrderArray = isZoneIncludedInRoute(gridOrderArray, routes, delivDate);
    
    // Adjust based on Product not being in place

    // Adjust based on Customer not being open

    // Adjust for route not existing today 


    // FINAL LOGIC ENDS HERE


    return gridOrderArray;
  };

  const constructColumns = () => {
    let gridToEdit = constructGridInfo();
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
