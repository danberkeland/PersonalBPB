import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import { ToggleContext } from "../../../dataContexts/ToggleContext";

import RouteGrid from "../ByRoute/Parts/RouteGrid";
import RouteList from "../ByRoute/Parts/RouteList";
import ToolBar from "../ByRoute/Parts/ToolBar";
import { todayPlus } from "../../../helpers/dateTimeHelpers";

import {
  promisedData,
  fetchAltPricing,
} from "../../../helpers/databaseFetchers";
import ComposeProductGrid from "./utils/composeProductGrid";

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

const compose = new ComposeProductGrid();

function ByRoute() {
  const [route, setRoute] = useState("AM Pastry");
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [routeList, setRouteList] = useState();
  const [orderList, setOrderList] = useState();
  const [altPricing, setAltPricing] = useState();
  const [database, setDatabase] = useState();
  

  let { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherProdGridInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherProdGridInfo = (data) => {
    let prodGridData = compose.returnProdGrid(data);
    setDatabase(data);
    setOrderList(prodGridData.prodGrid);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAltPricing();
  }, []);

  return (
    <React.Fragment>
      <MainWrapper>
        <RouteList
          orderList={orderList}
          setRouteList={setRouteList}
          setRoute={setRoute}
          routeList={routeList}
          database={database}
          delivDate={delivDate}
        />
        <DescripWrapper>
          <ToolBar
            setOrderList={setOrderList}
            database={database}
            setDelivDate={setDelivDate}
          />
          <RouteGrid
            route={route}
            orderList={orderList}
            altPricing={altPricing}
            setAltPricing={setAltPricing}
            database={database}
            delivDate={delivDate}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByRoute;
