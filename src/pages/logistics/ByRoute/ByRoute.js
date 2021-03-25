import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import { CustomerContext, CustomerLoad } from "../../../dataContexts/CustomerContext";
import { ProductsContext, ProductsLoad } from "../../../dataContexts/ProductsContext";
import { OrdersContext, OrdersLoad } from "../../../dataContexts/OrdersContext";
import { StandingContext, StandingLoad } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";


import RouteGrid from "../ByRoute/Parts/RouteGrid";
import RouteList from "../ByRoute/Parts/RouteList";
import ToolBar from "../ByRoute/Parts/ToolBar";

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
  const [ route, setRoute ] = useState();
  const [ routeList, setRouteList ] = useState();
  const [ orderList, setOrderList ] = useState();

  const { custLoaded, setCustLoaded } = useContext(CustomerContext);
  const { prodLoaded, setProdLoaded } = useContext(ProductsContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { ordersLoaded, setOrdersLoaded } = useContext(OrdersContext);
  let { standLoaded, setStandLoaded } = useContext(StandingContext);

  useEffect(() => {
    setCustLoaded(false);
    setProdLoaded(false);
    setHoldLoaded(true);
    setOrdersLoaded(false);
    setStandLoaded(false);
  }, []);

  return (
    <React.Fragment>

      {!ordersLoaded ? <OrdersLoad /> : ""}
      {!custLoaded ? <CustomerLoad /> : ""}
      {!prodLoaded ? <ProductsLoad /> : ""}
      {!standLoaded ? <StandingLoad /> : ""}

      <MainWrapper>
        <RouteList orderList={orderList} setRouteList={setRouteList} setRoute={setRoute} routeList={routeList}/>
        <DescripWrapper>
          <ToolBar setOrderList={setOrderList}/>
          <RouteGrid route={route} orderList={orderList}/>
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByRoute;
