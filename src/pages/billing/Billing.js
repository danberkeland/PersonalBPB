import React, { useEffect, useContext } from "react";

import styled from "styled-components";

import BillingGrid from "./Parts/BillingGrid";
import PublishGateKeeper from "./Parts/PublishGateKeeper";
import Buttons from "./Parts/Buttons";
import SelectDate from "./Parts/SelectDate";

import { CustomerContext, CustomerLoad } from "../../dataContexts/CustomerContext";
import { ProductsContext, ProductsLoad } from "../../dataContexts/ProductsContext";
import { OrdersContext, OrdersLoad } from "../../dataContexts/OrdersContext";
import { StandingContext, StandingLoad } from "../../dataContexts/StandingContext";
import { HoldingContext, HoldingLoad } from "../../dataContexts/HoldingContext";

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
  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext);
  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { orders, ordersLoaded, setOrdersLoaded } = useContext(OrdersContext);
  let { standing, standLoaded, setStandLoaded } = useContext(StandingContext);

  useEffect(() => {
    if (!products) {
      setProdLoaded(false);
    }
    if (!customers) {
      setCustLoaded(true);
    }
    setHoldLoaded(true);
    if (!orders) {
      setOrdersLoaded(true);
    }
    if (!standing) {
      setStandLoaded(true);
    }
  }, []);

  return (
    <React.Fragment>
      {!ordersLoaded ? <OrdersLoad /> : ""}
      {!custLoaded ? <CustomerLoad /> : ""}
      {!prodLoaded ? <ProductsLoad /> : ""}
      {!standLoaded ? <StandingLoad /> : ""}
      
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
