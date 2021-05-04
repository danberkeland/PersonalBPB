import React, { useContext, useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import TimeAgo from "timeago-react"; // var TimeAgo = require('timeago-react');
import us from "timeago.js/lib/lang/en_US";

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
import { CurrentDataContext } from "../../dataContexts/CurrentDataContext";

import {
  addDelivQty,
  addProdAttr,
  buildMakeFreshProdTemplate,
  addNeedEarly,
} from "../../helpers/prodBuildHelpers";

import {
  buildCartList,
  buildStandList,
  compileFullOrderList,
} from "../../helpers/CartBuildingHelpers";

import { API, graphqlOperation } from "aws-amplify";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const IngDetails = styled.div`
  font-size: 0.8em;
`;

const makeFresh = [];

const clonedeep = require("lodash.clonedeep");

const { DateTime } = require("luxon");

function BPBSWhatToMake() {
  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);
  const { custLoaded, setCustLoaded } = useContext(CustomerContext);
  let { holdLoaded, setHoldLoaded } = useContext(HoldingContext);
  let { orders, ordersLoaded, setOrdersLoaded } = useContext(OrdersContext);
  let { standing, standLoaded, setStandLoaded } = useContext(StandingContext);

  const [fullOrders, setFullOrders] = useState([]);
  const [freshProds, setFreshProds] = useState();

  let today = DateTime.now().setZone("America/Los_Angeles");
  let delivDate = today.toString().split("T")[0];

  useEffect(() => {
    setProdLoaded(false);
    setCustLoaded(false);
    setHoldLoaded(false);
    setOrdersLoaded(false);
    setStandLoaded(false);
  }, []);

  useEffect(() => {
    try {
      let buildOrders = buildCartList("*", delivDate, orders);
      let buildStand = buildStandList("*", delivDate, standing);
      let fullOrder = compileFullOrderList(buildOrders, buildStand);
      fullOrder = addProdAttr(fullOrder, products); // adds forBake, packSize, currentStock
      setFullOrders(fullOrder);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, products]);

  useEffect(() => {
    try {
      let makeFreshProds = buildMakeFreshProdTemplate(products);
      for (let make of makeFreshProds) {
        addDelivQty(make, fullOrders);
        addNeedEarly(make, products);
      }
      setFreshProds(makeFreshProds);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, products]);

  


  return (
    <React.Fragment>
      <WholeBox>
        {!ordersLoaded ? <OrdersLoad /> : ""}
        {!custLoaded ? <CustomerLoad /> : ""}
        {!prodLoaded ? <ProductsLoad /> : ""}
        {!standLoaded ? <StandingLoad /> : ""}
        {!holdLoaded ? <HoldingLoad /> : ""}
        <h1>BPBS What To Make</h1>

        <h2>Make Fresh</h2>

        <DataTable value={freshProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="needEarly" header="Need Early"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
         
          
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBSWhatToMake;
