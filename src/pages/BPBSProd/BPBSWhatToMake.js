import React, { useContext, useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import TimeAgo from "timeago-react"; // var TimeAgo = require('timeago-react');
import us from "timeago.js/lib/lang/en_US";

import { CustomerLoad, CustomerContext } from "../../dataContexts/CustomerContext";
import {
  ProductsContext,
  ProductsLoad,
} from "../../dataContexts/ProductsContext";
import { OrdersLoad, OrdersContext } from "../../dataContexts/OrdersContext";
import { StandingLoad, StandingContext } from "../../dataContexts/StandingContext";
import { HoldingLoad, HoldingContext } from "../../dataContexts/HoldingContext";
import { CurrentDataContext } from "../../dataContexts/CurrentDataContext";

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

const makeFresh = [];

const clonedeep = require("lodash.clonedeep");

const { DateTime } = require("luxon");

function BPBSWhatToMake() {
  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);
  const { custLoaded, setCustLoaded } = useContext(CustomerContext);
  let { holdLoaded, setHoldLoaded } = useContext(HoldingContext);
  let { orders, ordersLoaded, setOrdersLoaded } = useContext(OrdersContext);
  let { standing, standLoaded, setStandLoaded } = useContext(StandingContext);

  const [ fullOrders, setFullOrders ] = useState([])
  const [ freshProds, setFreshProds ] = useState()

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

      // attach forBake to fullOrder
      for (let order of fullOrder) {
        let ind = products[products.findIndex(prod => prod.prodName === order.prodName)]
        order.forBake = ind.forBake
        order.packSize = ind.packSize
        order.currentStock = ind.currentStock
      }
      setFullOrders(fullOrder)
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, products]);



  useEffect(() => {
    try {
      let makeFreshProds;
      makeFreshProds = Array.from(
        new Set(
          products
            .filter(
              (prod) =>
                !prod.bakedWhere.includes("Carlton") &&
                Number(prod.readyTime) < 15 &&
                prod.packGroup !== "frozen pastries" &&
                prod.packGroup !== "baked pastries"
            )
            .map((prod) => prod.forBake)
        )
      ).map((make) => ({
        forBake: make,
        qty: 0,
        needEarly: 0,
        makeTotal: 0,
      }));

      
      
      for (let make of makeFreshProds) {
        const addUp = (acc, val) => {
          return acc + val;
        };
        make.qty = 0;
        make.needEarly = 0;
        let qty = fullOrders
          .filter((full) => make.forBake === full.forBake)
          .map((ord) => ord.qty);
        if (qty.length > 0) {
          let qtyAcc = qty.reduce(addUp);
          make.qty = qtyAcc;
          make.needEarly = qtyAcc;      
        }
        let curr = products
          .filter((full) => make.forBake === full.forBake)
          .map((ord) => ord.currentStock);
          console.log(curr)
          if (curr.length > 0) {
            let currAcc = curr.reduce(addUp);
            make.needEarly -= currAcc;      
          }
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
