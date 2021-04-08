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
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import RouteGrid from "../ByRoute/Parts/RouteGrid";
import RouteList from "../ByRoute/Parts/RouteList";
import ToolBar from "../ByRoute/Parts/ToolBar";

import { listAltPricings } from "../../../graphql/queries";

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

const fetchInfo = async (operation, opString, limit) => {
  try {
    let info = await API.graphql(
      graphqlOperation(operation, {
        limit: limit,
      })
    );
    let list = info.data[opString].items;

    let noDelete = list.filter((li) => li["_deleted"] !== true);
    return noDelete;
  } catch {
    return [];
  }
};

function ByRoute() {
  const [route, setRoute] = useState("AM Pastry");
  const [routeList, setRouteList] = useState();
  const [orderList, setOrderList] = useState();
  const [ altPricing, setAltPricing ] = useState();

  const { custLoaded, setCustLoaded } = useContext(CustomerContext);
  const { prodLoaded, setProdLoaded } = useContext(ProductsContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { ordersLoaded, setOrdersLoaded } = useContext(OrdersContext);
  let { standLoaded, setStandLoaded } = useContext(StandingContext);
  let { setIsLoading } = useContext(ToggleContext)

  useEffect(() => {
    setCustLoaded(false);
    setProdLoaded(false);
    setHoldLoaded(true);
    setOrdersLoaded(false);
    setStandLoaded(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchAltPricing();
    
  }, []);


  const fetchAltPricing = async () => {
    try {
      let altPricing = await fetchInfo(listAltPricings,"listAltPricings", "1000");
      setAltPricing(altPricing);   
    } catch (error) {
      console.log("error on fetching Alt Pricing List", error);
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
          <RouteGrid route={route} orderList={orderList} altPricing={altPricing} setAltPricing={setAltPricing}/>
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByRoute;
