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
  margin: 0px 10px;
  padding: 0px 10px;
  flex-direction: column;
  justify-items: start;
  align-content: flex-start;
  width: 100%;
  background: #ffffff;
`;

function ByCustomer() {
  const [routes, setRoutes] = useState(null);

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
        <RouteList routes={routes} setRoutes={setRoutes} />
        <DescripWrapper>
          <ToolBar />
          <RouteGrid routes={routes} setRoutes={setRoutes} />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByCustomer;
