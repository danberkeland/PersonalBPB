import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import { ToggleContext } from "../../../dataContexts/ToggleContext";

import ProductGrid from "../ByProduct/Parts/ProductGrid";
import ToolBar from "../ByProduct/Parts/ToolBar";
import { todayPlus } from "../../../helpers/dateTimeHelpers";
import {promisedData} from "../../../helpers/databaseFetchers";
import ComposeProductGrid from "../../logistics/ByRoute/Parts/utils/composeProductGrid";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
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

function ByProduct() { 
  const [delivDate, setDelivDate] = useState(todayPlus()[0]); 
  const [orderList, setOrderList] = useState();
  const [database, setDatabase] = useState([]);
  let { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherProdGridInfo(database));
  }, [delivDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherProdGridInfo = (data) => {
    let prodGridData = compose.returnProdGrid(data, delivDate);
    setDatabase(data);
    console.log(prodGridData.prodGrid)
    setOrderList(prodGridData.prodGrid);
  };

  return (
    <React.Fragment>
      <MainWrapper>
        <DescripWrapper>
          <ToolBar delivDate={delivDate} setDelivDate={setDelivDate}  />
          <ProductGrid
            orderList={orderList}
            database={database}
            delivDate={delivDate}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByProduct;
