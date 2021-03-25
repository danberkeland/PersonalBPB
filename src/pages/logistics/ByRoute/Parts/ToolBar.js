import React, { useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { OrdersContext } from "../../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../../dataContexts/StandingContext";
import { ProductsContext } from "../../../../dataContexts/ProductsContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";
import { CustomerContext } from "../../../../dataContexts/CustomerContext";
import { RoutesContext } from "../../../../dataContexts/RoutesContext";

import {
  buildCartList,
  buildStandList,
  compileFullOrderList,
} from "../../../../helpers/CartBuildingHelpers";

import {
  removeDoubles,
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../../helpers/delivGridHelpers";

import {
  sortZtoADataByIndex,
  sortAtoZDataByIndex,
} from "../../../../helpers/sortDataHelpers";

import { Calendar } from "primereact/calendar";

import { listRoutes } from "../../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

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
    if (productCanMakeIt(grd, routes, rte)) {
      return true;
    } else {
      return false;
    }
  }
};

const productCanMakeIt = (grd, routes, rte) => {
  for (let testRte of routes) {
    if (
      grd["where"].includes(testRte["RouteDepart"]) &&
      testRte["RouteArrive"] === rte["RouteDepart"] &&
      Number(testRte["routeStart"] + testRte["routeTime"]) <
        Number(rte["routeStart"])
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
    Number(
      routes[routes.findIndex((rt) => rt["routeName"] === rte["routeName"])][
        "routeStart"
      ]
    ) +
      Number(
        routes[routes.findIndex((rt) => rt["routeName"] === rte["routeName"])][
          "routeTime"
        ]
      )
  ) {
    return true;
  } else {
    return false;
  }
};

const ToolBar = ({ setOrderList }) => {
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);
  const { orders } = useContext(OrdersContext);
  const { standing } = useContext(StandingContext);
  const { customers } = useContext(CustomerContext);
  const { products } = useContext(ProductsContext);
  const { routes, setRoutes } = useContext(RoutesContext);
  let { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    setIsLoading(true);
    fetchRoutes();
    setIsLoading(false);
  }, [routes]);

  const fetchRoutes = async () => {
    try {
      const routeData = await API.graphql(
        graphqlOperation(listRoutes, {
          limit: "50",
        })
      );
      const routeList = routeData.data.listRoutes.items;
      sortAtoZDataByIndex(routeList, "routeStart");
      let noDelete = routeList.filter((route) => route["_deleted"] !== true);

      setRoutes(noDelete);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  useEffect(() => {
    let buildOrders = buildCartList("*", delivDate, orders);
    let buildStand = buildStandList("*", delivDate, standing);
    let fullOrder = compileFullOrderList(buildOrders, buildStand);
    let ordList = removeDoubles(fullOrder);
    let noZeroDelivDateOrderList = zerosDelivFilter(
      ordList,
      delivDate,
      customers
    );

    let gridOrderArray = buildGridOrderArray(
      noZeroDelivDateOrderList,
      products
    );

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

    setOrderList(gridOrderArray);
  }, [delivDate]);

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
  };

  return (
    <React.Fragment>
      <div className="p-field p-col-12 p-md-4">
        <label htmlFor="delivDate">Pick Delivery Date: </label>
        <Calendar
          id="delivDate"
          dateFormat="mm/dd/yy"
          onChange={(e) => setDate(e.value)}
        />
      </div>
    </React.Fragment>
  );
};

export default ToolBar;
