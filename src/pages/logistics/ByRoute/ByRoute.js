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
import ComposeProductGrid from "./Parts/utils/composeProductGrid";

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
  const [database, setDatabase] = useState([]);

  let { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherProdGridInfo(database));
  }, [delivDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherProdGridInfo = (data) => {
    let prodGridData = compose.returnProdGrid(data, delivDate);
    setDatabase(data);
    setOrderList(prodGridData.prodGrid);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAltPricing().then(data => setAltPricing(data))
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
        />
        <DescripWrapper>
          <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
          <RouteGrid
            route={route}
            orderList={orderList}
            altPricing={altPricing}
            database={database}
            delivDate={delivDate}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByRoute;
