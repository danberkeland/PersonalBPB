import { useState, useEffect, useContext } from "react";

import { OrdersContext } from "../../dataContexts/OrdersContext";
import { ProductsContext } from "../../dataContexts/ProductsContext";
import { CustomerContext } from "../../dataContexts/CustomerContext";
import { StandingContext } from "../../dataContexts/StandingContext";

import {
  buildCartList,
  buildStandList,
  compileFullOrderList,
} from "../../helpers/CartBuildingHelpers";

import { addProdAttr } from "../../helpers/prodBuildHelpers";

import { todayPlus } from "../../helpers/dateTimeHelpers";

const useOrderBuilder = () => {
  const { products } = useContext(ProductsContext);
  const { customers } = useContext(CustomerContext);
  let { orders } = useContext(OrdersContext);
  let { standing } = useContext(StandingContext);

  let twoDay = todayPlus()[2];
  let tomorrow = todayPlus()[1];

  const [setFullOrdersTwoDay] = useState([]);
  const [setFullOrdersTomorrow] = useState([]);

  useEffect(() => {
    try {
      let buildOrders = buildCartList("*", twoDay, orders);
      let buildStand = buildStandList("*", twoDay, standing);
      let fullOrder = compileFullOrderList(buildOrders, buildStand);
      fullOrder = addProdAttr(fullOrder, products, customers); // adds forBake, packSize, currentStock
      setFullOrdersTwoDay(fullOrder);
    } catch {
      console.log("Whoops");
    }

    try {
      let buildOrders = buildCartList("*", tomorrow, orders);
      let buildStand = buildStandList("*", tomorrow, standing);
      let fullOrder = compileFullOrderList(buildOrders, buildStand);
      fullOrder = addProdAttr(fullOrder, products, customers); // adds forBake, packSize, currentStock
      setFullOrdersTomorrow(fullOrder);
    } catch {
      console.log("Whoops");
    }
  }, [tomorrow, twoDay, orders, standing, products, customers]);
};

export default useOrderBuilder;
