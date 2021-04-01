import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import {
  CustomerContext,
  CustomerLoad,
} from "../../../dataContexts/CustomerContext";
import {
  ProductsContext,
  ProductsLoad,
} from "../../../dataContexts/ProductsContext";
import { OrdersContext, OrdersLoad } from "../../../dataContexts/OrdersContext";
import {
  StandingContext,
  StandingLoad,
} from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";

import RouteGrid from "../ByRoute/Parts/RouteGrid";
import RouteList from "../ByRoute/Parts/RouteList";
import ToolBar from "../ByRoute/Parts/ToolBar";

import { createOrder } from "../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr;
  height: 100vh;
`;

const DescripWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 95%;
  margin: 10px auto;
  flex-direction: column;
  justify-items: start;
  align-content: flex-start;

  background: #ffffff;
`;

function ByRoute() {
  const [route, setRoute] = useState("AM Pastry");
  const [routeList, setRouteList] = useState();
  const [orderList, setOrderList] = useState();

  const { custLoaded, setCustLoaded } = useContext(CustomerContext);
  const { prodLoaded, setProdLoaded } = useContext(ProductsContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { orders, ordersLoaded, setOrdersLoaded } = useContext(OrdersContext);
  let { standLoaded, setStandLoaded } = useContext(StandingContext);

  useEffect(() => {
    setCustLoaded(false);
    setProdLoaded(false);
    setHoldLoaded(true);
    setOrdersLoaded(false);
    setStandLoaded(false);
  }, []);

  useEffect(() => {
    fetchSq()
  },[])


  const fetchSq = async () => {
    try {
      let response = await fetch(
        "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"
      );

      let newOrders = await response.json();
      newOrders = JSON.parse(newOrders)
      for (let newOrd of newOrders){
        
        if (!orders.findIndex[(ord) => ord["id"] === newOrd["id]"]]) {
          let qty = Number(newOrd["qty"]);
          let dt = new Date().toISOString()
         
          let delivDate = newOrd["delivDate"].split("T")[0]
          delivDate = delivDate.split('-')
          delivDate = delivDate[1]+"/"+delivDate[2]+"/"+delivDate[0]
          
         
          let custName = newOrd["custName"]
          let prodName
          let route
          let itemToAdd = {
            id: newOrd["id"],
            SO: qty,
            qty: qty,
            createdAt: dt,
            timeStamp: dt,
            updatedAt: dt,
            isWhole: false,
            PONote: "paid",
            delivDate: delivDate,
            custName: custName,
            prodName: "tacos",
            route: "slopick"
          };
          console.log(itemToAdd)
      }}
    } catch {
      console.log("Request Failed");
    }
  }; 

  const enterNewOrders = async (newOrders) => {
    console.log(newOrders)
    // Go order for order in orders
    for (let newOrd of newOrders) {
      // if newOrder does not exist
      if (orders.findIndex[(ord) => ord["squareID"] === newOrd["id]"]] < 0) {
        let qty = Number(newOrd["qty"]);
        let dt;
        let delivDate = newOrd["delivDate"].split("T")[0]
        console.log(delivDate)
        let custName = newOrd["custName"]
        let prodName;
        let itemToAdd = {
          SO: qty,
          qty: qty,
          createdAt: dt,
          timeStamp: dt,
          updatedAt: dt,
          isWhole: false,
          PONote: "paid",
          delivDate: delivDate,
          custName: custName,
          prodName: prodName,
        };
        // add object to orders db
        /*
        try {
          await API.graphql(
            graphqlOperation(createOrder, { input: { ...itemToAdd } })
          );
        } catch (error) {
          console.log("error on creating Orders", error);
        }
        */
      }
    }
  };

  return (
    <React.Fragment>
      {!ordersLoaded ? <OrdersLoad /> : ""}
      {!custLoaded ? <CustomerLoad /> : ""}
      {!prodLoaded ? <ProductsLoad /> : ""}
      {!standLoaded ? <StandingLoad /> : ""}

      <MainWrapper>
        <RouteList
          orderList={orderList}
          setRouteList={setRouteList}
          setRoute={setRoute}
          routeList={routeList}
        />
        <DescripWrapper>
          <ToolBar setOrderList={setOrderList} />
          <RouteGrid route={route} orderList={orderList} />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByRoute;
