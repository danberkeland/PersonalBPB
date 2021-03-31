import React, { useEffect, useContext, useState } from "react";

import styled from "styled-components";

import BillingGrid from "./Parts/BillingGrid";

import Buttons from "./Parts/Buttons";
import SelectDate from "./Parts/SelectDate";

import { CustomerContext, CustomerLoad } from "../../dataContexts/CustomerContext";
import { ProductsContext, ProductsLoad } from "../../dataContexts/ProductsContext";
import { OrdersContext, OrdersLoad } from "../../dataContexts/OrdersContext";
import { StandingContext, StandingLoad } from "../../dataContexts/StandingContext";
import { HoldingContext } from "../../dataContexts/HoldingContext";
import { ToggleContext } from "../../dataContexts/ToggleContext";

import { listAltPricings, listZones } from "../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";


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
  let { setIsLoading } = useContext(ToggleContext)

  const [ altPricing, setAltPricing ] = useState()
  const [ nextInv, setNextInv ] = useState(0);
  const [invoices, setInvoices] = useState();
  const [ zones, setZones ] = useState()

  useEffect(() => {
    if (!products) {
      setProdLoaded(false);
    }
    if (!customers) {
      setCustLoaded(false);
    }
    setHoldLoaded(true);
    if (!orders) {
      setOrdersLoaded(false);
    }
    if (!standing) {
      setStandLoaded(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchAltPricing();
    setIsLoading(false);
  }, []);

  const fetchAltPricing = async () => {
    try {
      const altPricingData = await API.graphql(
        graphqlOperation(listAltPricings, {
          limit: "1000",
        })
      );
      
      setAltPricing(altPricingData.data.listAltPricings.items);
    } catch (error) {
      console.log("error on fetching Alt Pricing List", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchZones();
    setIsLoading(false);
  }, []);

  const fetchZones = async () => {
    try {
      const zoneData = await API.graphql(
        graphqlOperation(listZones, {
          limit: "50",
        })
      );
      const zoneList = zoneData.data.listZones.items;
      
      let noDelete = zoneList.filter((zone) => zone["_deleted"] !== true);
  
      setZones(noDelete)
    } catch (error) {
      console.log("error on fetching Zone List", error);
    }
  };

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
        <SelectDate nextInv={nextInv} setNextInv={setNextInv} invoices={invoices} setInvoices={setInvoices}/>
      </BasicContainer>
     
      <Buttons />
     
      <BasicContainer>
        <BillingGrid altPricing={altPricing} nextInv={nextInv} invoices={invoices} setInvoices={setInvoices} zones={zones}/>
      </BasicContainer>
    </React.Fragment>
  );
}

export default Billing;
