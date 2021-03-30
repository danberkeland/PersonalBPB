import React, { useEffect, useContext } from "react";

import styled from "styled-components";

import BillingGrid from "./Parts/BillingGrid";
import PublishGateKeeper from "./Parts/PublishGateKeeper";
import Buttons from "./Parts/Buttons";
import SelectDate from "./Parts/SelectDate";

import { CustomerContext } from "../../dataContexts/CustomerContext";
import { ProductsContext } from "../../dataContexts/ProductsContext";
import { OrdersContext } from "../../dataContexts/OrdersContext";
import { StandingContext } from "../../dataContexts/StandingContext";
import { HoldingContext } from "../../dataContexts/HoldingContext";

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  border: 1px solid lightgray;
  padding: 5px 10px;
  margin: 0px auto;
  box-sizing: border-box;
`;

function Billing() {
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
      <BasicContainer>
        <h1>Billing</h1>
      </BasicContainer>
      
      <BasicContainer>
        <SelectDate />
      </BasicContainer>
     
      <Buttons />
      <PublishGateKeeper />
      <BasicContainer>
        <BillingGrid />
      </BasicContainer>
    </React.Fragment>
  );
}

export default Billing;
