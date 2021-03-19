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
  sortZtoADataByIndex,
  sortAtoZDataByIndex,
} from "../../../../helpers/sortDataHelpers";
import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";

const RouteGrid = ({ routes, setRoutes }) => {
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

    for (let i = 0; i < orderList.length; ++i) {
      for (let j = i + 1; j < orderList.length; ++j) {
        if (
          orderList[i]["prodName"] === orderList[j]["prodName"] &&
          orderList[i]["custName"] === orderList[j]["custName"]
        ) {
          orderList.splice(j, 1);
        }
      }
    }
    let noZeroDelivDateOrderList = orderList.filter(
      (ord) =>
        Number(ord["qty"]) > 0 &&
        ord["delivDate"] === convertDatetoBPBDate(delivDate)
    );
    for (let ord of noZeroDelivDateOrderList) {
      if (ord["route"] === undefined || ord["route"] === "deliv") {
        let ind = customers.findIndex(
          (cust) => cust["custName"] === ord["custName"]
        );
        if (ind > -1) {
          let custRoute = customers[ind]["zoneName"];
          ord["route"] = custRoute;
        }
      }
    }
    let filterServe;
    if (routes) {
      let rtInd = routes.findIndex((rt) => rt["routeName"] === route);
      filterServe = noZeroDelivDateOrderList.filter((ord) =>
        routes[rtInd]["RouteServe"].includes(ord["route"])
      );
    }

    if (!filterServe) {
      return;
    }

    let gridOrderArray;
    gridOrderArray = filterServe.map((ord) => ({
      prodName: ord["prodName"],
      custName: ord["custName"],
      zone: ord["route"],
      route: "",
      qty: ord["qty"],
      where:
        products[
          products.findIndex((prod) => prod["prodName"] === ord["prodName"])
        ]["bakedWhere"],
      when:
        products[
          products.findIndex((prod) => prod["prodName"] === ord["prodName"])
        ]["readyTime"],
    }));

    sortZtoADataByIndex(routes, "routeStart");
    for (let rte of routes) {
      for (let grd of gridOrderArray) {
        if (
          !rte["RouteServe"].includes(grd["zone"]) &&
          customers[
            customers.findIndex((cust) => cust["custName"] === grd["custName"])
          ]["latestFirstDeliv"] < rte["routeStart"]
        ) {
          break;
        } else {
          grd["route"] = rte["routeName"];
        }
      }
    }

    console.log(gridOrderArray)
    return gridOrderArray;
  };

  const constructColumns = () => {
    let gridInfo = constructGridInfo();

    let listOfProducts;
    if (!gridInfo){return}
    listOfProducts = gridInfo.map((order) => order["prodName"]);
    listOfProducts = new Set(listOfProducts);
    let prodArray = [];
    for (let prod of listOfProducts) {
      for (let item of products) {
        if (prod === item["prodName"]) {
          let newItem = [
            prod,
            item["nickName"],
            item["packGroup"],
            item["packSize"],
          ];
          prodArray.push(newItem);
        }
      }
    }

    sortAtoZDataByIndex(prodArray, 2);

    let columns = [
      { field: "customer", header: "Customer", width: { width: "10%" } },
    ];
    for (let prod of prodArray) {
      let newCol = {
        field: prod[0],
        header: prod[1],
        width: { width: "30px" },
      };
      columns.push(newCol);
    }
    console.log(columns);
    return columns;
  };

  const constructData = () => {
    let gridInfo = constructGridInfo();

    if (!gridInfo) {
      return;
    }

    let orderList = gridInfo.filter((order) => order["route"] === route);
    let listOfCustomers = orderList.map((order) => order["custName"]);
    listOfCustomers = new Set(listOfCustomers);

    let data = [];
    for (let cust of listOfCustomers) {
      let newData = { customer: cust };
      for (let order of orderList) {
        if (order["custName"] === cust) {
          newData[order["prodName"]] = order["qty"];
        }
      }

      data.push(newData);
    }

    return data;
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
