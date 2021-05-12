import React, { useState, useContext, useEffect } from "react";

import styled from "styled-components";
import ProductGrid from "../ByProduct/Parts/ProductGrid";
import ToolBar from "../ByProduct/Parts/ToolBar";
import { ToggleContext } from "../../../dataContexts/ToggleContext";
import { todayPlus } from "../../../helpers/dateTimeHelpers";
import { promisedData  } from "../../../helpers/databaseFetchers";
//import ComposeProductGrid from "./utils/composeProductGrid";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
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

//const compose = new ComposeProductGrid();

function ByProduct() {
  const { setIsLoading } = useContext(ToggleContext);
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [prodGridData, setProdGridData] = useState([]);
  const [database, setDatabase] = useState([]);

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherMakeInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherMakeInfo = (data) => {
    //let prodGridData = compose.returnNorthBreakDown(data);
    setDatabase(data);
    setProdGridData(prodGridData);
  };

  return (
    <React.Fragment>
      <MainWrapper>
        <DescripWrapper>
          <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
          <ProductGrid
            delivDate={delivDate}
            setDelivDate={setDelivDate}
            prodGridData={prodGridData}
            database={database}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default ByProduct;
