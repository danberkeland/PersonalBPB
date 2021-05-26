import React, { useState, useEffect, useContext } from "react";

import Calendar from "./Parts/Calendar";
import CurrentOrderInfo from "./Parts/CurrentOrderInfo";
import CurrentOrderList from "./Parts/CurrentOrderList";
import OrderCommandLine from "./Parts/OrderCommandLine";
import OrderEntryButtons from "./Parts/OrderEntryButtons";

import { promisedData } from "../../helpers/databaseFetchers";

import styled from "styled-components";
import { ToggleContext } from "../../dataContexts/ToggleContext";

const MainWindow = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
`;

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  border: 1px solid lightgray;
  padding: 10px 10px;
  margin: 0px 10px;
  box-sizing: border-box;
`;

function Ordering() {

  const [ database, setDatabase ] = useState([])
  const { reload, setIsLoading } = useContext(ToggleContext)
  
  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      setDatabase(database)
    );
  }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <MainWindow>
      
      <BasicContainer>
        <Calendar database={database}/>
      </BasicContainer>
      <BasicContainer>
        <OrderCommandLine database={database} setDatabase={setDatabase}/>
        <CurrentOrderInfo database={database} setDatabase={setDatabase}/>
        <CurrentOrderList database={database} setDatabase={setDatabase}/>
        <OrderEntryButtons database={database} setDatabase={setDatabase}/>
      </BasicContainer>
    </MainWindow>
  );
}

export default Ordering;
