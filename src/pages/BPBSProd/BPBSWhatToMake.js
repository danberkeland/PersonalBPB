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
  addFreshQty,
  addPocketsQty,
  addProdAttr,
  buildMakeFreshProdTemplate,
  addNeedEarly,
  buildMakeShelfProdTemplate,
  buildMakeFreezerProdTemplate,
  buildMakePocketsNorthTemplate,
} from "../../helpers/prodBuildHelpers";

import {
  buildCartList,
  buildStandList,
  compileFullOrderList,
} from "../../helpers/CartBuildingHelpers";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers"

import { API, graphqlOperation } from "aws-amplify";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;


const clonedeep = require("lodash.clonedeep");

const { DateTime } = require("luxon");

function BPBSWhatToMake() {
  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);
  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext);
  let { holdLoaded, setHoldLoaded } = useContext(HoldingContext);
  let { orders, ordersLoaded, setOrdersLoaded } = useContext(OrdersContext);
  let { standing, standLoaded, setStandLoaded } = useContext(StandingContext);

  const [ fullOrdersToday, setFullOrdersToday ] = useState([]);
  const [ fullOrdersTomorrow, setFullOrdersTomorrow ] = useState([]);
  const [ freshProds, setFreshProds ] = useState();
  const [ shelfProds, setShelfProds ] = useState()
  const [ freezerProds, setFreezerProds ] = useState();
  const [ pocketsNorth, setPocketsNorth ] = useState();

  let delivDate = todayPlus()[0];
  let tomorrow = todayPlus()[1];
  
  
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
      fullOrder = addProdAttr(fullOrder, products, customers); // adds forBake, packSize, currentStock
      setFullOrdersToday(fullOrder);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, products, customers]);

  useEffect(() => {
    
    try {
      let buildOrders = buildCartList("*", tomorrow, orders);
      let buildStand = buildStandList("*", tomorrow, standing);
      let fullOrder = compileFullOrderList(buildOrders, buildStand);
      fullOrder = addProdAttr(fullOrder, products, customers); // adds forBake, packSize, currentStock
      setFullOrdersTomorrow(fullOrder);
    } catch {
      console.log("Whoops");
    }
  }, [tomorrow, orders, standing, products, customers]);

  useEffect(() => {
    try {
      let makeFreshProds = buildMakeFreshProdTemplate(products);
      for (let make of makeFreshProds) {
        addFreshQty(make, fullOrdersToday);
        addNeedEarly(make, products);
      }
      setFreshProds(makeFreshProds);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, products, customers]);

  useEffect(() => {
    try {
      let makeShelfProds = buildMakeShelfProdTemplate(products);
      for (let make of makeShelfProds) {
        addDelivQty(make, fullOrdersToday);
        addNeedEarly(make, products);
      }
      setShelfProds(makeShelfProds);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, products, customers]);

  useEffect(() => {
    try {
      let makeFreezerProds = buildMakeFreezerProdTemplate(products);
      for (let make of makeFreezerProds) {
        addDelivQty(make, fullOrdersToday);
        addNeedEarly(make, products);
      }
      setFreezerProds(makeFreezerProds);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, products, customers]);

  useEffect(() => {
    try {
      let makePocketsNorth = buildMakePocketsNorthTemplate(products);
      for (let make of makePocketsNorth) {
        addPocketsQty(make, fullOrdersToday);
        addNeedEarly(make, products);
      }
      setPocketsNorth(makePocketsNorth);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, products, customers]);
  
  
  

  return (
    <React.Fragment>
      <WholeBox>
        {!ordersLoaded ? <OrdersLoad /> : ""}
        {!custLoaded ? <CustomerLoad /> : ""}
        {!prodLoaded ? <ProductsLoad /> : ""}
        {!standLoaded ? <StandingLoad /> : ""}
        {!holdLoaded ? <HoldingLoad /> : ""}
        <h1>BPBS What To Make {convertDatetoBPBDate(delivDate)}</h1>

        <h2>Send Pockets North</h2>
        <DataTable value={pocketsNorth} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
         
        </DataTable>

        <h2>Make Fresh</h2>
        <DataTable value={freshProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="needEarly" header="Need Early"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>     
        </DataTable>
        <h2>Make For Shelf</h2>
        <DataTable value={shelfProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="needEarly" header="Need Early"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>     
        </DataTable>
        <h2>Make For Freezer</h2>
        <DataTable value={freezerProds} className="p-datatable-sm">
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
