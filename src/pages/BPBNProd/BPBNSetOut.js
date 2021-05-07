import React, { useContext, useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {
  CustomerLoad,
  CustomerContext,
} from "../../dataContexts/CustomerContext";
import {
  ProductsContext,
  ProductsLoad,
} from "../../dataContexts/ProductsContext";
import { OrdersLoad, OrdersContext } from "../../dataContexts/OrdersContext";
import {
  StandingLoad,
  StandingContext,
} from "../../dataContexts/StandingContext";
import { HoldingLoad, HoldingContext } from "../../dataContexts/HoldingContext";
import { RoutesLoad, RoutesContext } from "../../dataContexts/RoutesContext";
import { addProdAttr, buildSetOutTemplate, addSetOut } from "../../helpers/prodBuildHelpers";

import useOrderBuilder from "./buildorders"
 
import {
  buildCartList,
  buildStandList,
  compileFullOrderList,
} from "../../helpers/CartBuildingHelpers";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin: auto;
  padding: 0 0 100px 0;
`;

function BPBNSetOut({ loc }) {
  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);
  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext);
  let { holdLoaded, setHoldLoaded } = useContext(HoldingContext);
  let { orders, ordersLoaded, setOrdersLoaded } = useContext(OrdersContext);
  let { standing, standLoaded, setStandLoaded } = useContext(StandingContext);
  let { routes, routesLoaded, setRoutesLoaded } = useContext(RoutesContext);

  const [ fullOrdersTwoDay, setFullOrdersTwoDay ] = useState([]);
  const [ fullOrdersTomorrow, setFullOrdersTomorrow ] = useState([]);
  const [ setOut, setSetOut ] = useState([])

  let twoDay = todayPlus()[2];
  let tomorrow = todayPlus()[1];
  let delivDate = todayPlus()[0];

  useEffect(() => {
    setRoutesLoaded(false);
    setProdLoaded(false);
    setCustLoaded(false);
    setHoldLoaded(false);
    setOrdersLoaded(false);
    setStandLoaded(false);
  }, []);



  
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
  }, [tomorrow, delivDate, orders, standing, products, customers]);
  
  useEffect(() => {
    try {
      let makeSetOut = buildSetOutTemplate(products, loc);
      for (let make of makeSetOut) {
        addSetOut(make, fullOrdersTwoDay, fullOrdersTomorrow, routes, loc)
        
      }
      setSetOut(makeSetOut);
    } catch {
      console.log("Whoops");
    }
  }, [products, fullOrdersTwoDay, fullOrdersTomorrow]);

  return (
    <React.Fragment>
      <WholeBox>
        {!ordersLoaded ? <OrdersLoad /> : ""}
        {!custLoaded ? <CustomerLoad /> : ""}
        {!prodLoaded ? <ProductsLoad /> : ""}
        {!standLoaded ? <StandingLoad /> : ""}
        {!holdLoaded ? <HoldingLoad /> : ""}
        {!routesLoaded ? <RoutesLoad /> : ""}
        <h1>
          {loc} Set Out {convertDatetoBPBDate(delivDate)}
        </h1>

        <h2>Set Out</h2>
        <DataTable value={setOut} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNSetOut;
