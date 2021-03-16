import React, { useContext, useEffect } from "react";

import styled from "styled-components";

import {CustomerContext} from "../../../dataContexts/CustomerContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";

import RouteGrid from "../ByRoute/Parts/RouteGrid"


const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
  height: 100vh;
`;



function ByRoute() {

  const { setCustLoaded } = useContext(CustomerContext);
  const { setProdLoaded } = useContext(ProductsContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  useEffect(() => {
    
    setCustLoaded(true);
    setProdLoaded(true);
    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  return (
    <React.Fragment>
      <MainWrapper>
        <RouteGrid />
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByRoute;
