import React, { useEffect, useContext, useRef } from "react";

import Calendar from "./Parts/Calendar";
import CurrentOrderInfo from "./Parts/CurrentOrderInfo";
import CurrentOrderList from "./Parts/CurrentOrderList";
import OrderCommandLine from "./Parts/OrderCommandLine";
import OrderEntryButtons from "./Parts/OrderEntryButtons";
import CustomerGroup from "./Parts/CurrentOrderInfoParts/CustomerGroup";

import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

import { todayPlus, checkDeadlineStatus } from "../../helpers/dateTimeHelpers";
import { promisedData, checkForUpdates } from "../../helpers/databaseFetchers";

import { ToggleContext } from "../../dataContexts/ToggleContext";
import { CurrentDataContext } from "../../dataContexts/CurrentDataContext";

import styled from "styled-components";

const MainWindow = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
`;

const MainWindowPhone = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr;
`;

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  border: 1px solid lightgray;
  padding: 10px 10px;
  margin: 5px 10px;
  box-sizing: border-box;
`;

const Title = styled.h2`
  padding: 0;
  margin: 5px 10px;
  color: rgb(66, 97, 201);
`;

const DateStyle = styled.div`
  padding: 0;
  color: grey;
  margin: 5px 10px;
`;

function Ordering() {
  const {
    reload,
    setIsLoading,
    setModifications,
    ordersHasBeenChanged,
    setOrdersHasBeenChanged,
    deadlinePassed,
    setDeadlinePassed,
  } = useContext(ToggleContext);

  const {
    authType,
    largeScreen,
    database,
    setDatabase,
    delivDate,
    setDelivDate
    
  } = useContext(CurrentDataContext);

  const [products, customers, routes, standing, orders] = database;
 
  const toast = useRef(null);

  useEffect(() => {
    let deadlineStatus = false;
    if (authType !== "bpbadmin") {
      deadlineStatus = checkDeadlineStatus(delivDate);
    }
    setDeadlinePassed(deadlineStatus);

    if (deadlineStatus) {
      confirmDialog({
        message:
          "6:00 PM order deadline for tomorrow has passed.  Next available order date is " +
          todayPlus()[2] +
          ". Continue?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => setDelivDate(todayPlus()[2]),
      });
    }
  }, [delivDate, authType]);

  useEffect(() => {
    promisedData(setIsLoading)
      .then((database) =>
        checkForUpdates(
          database,
          ordersHasBeenChanged,
          setOrdersHasBeenChanged,
          delivDate,
          setIsLoading
        )
      )
      .then((database) => setDatabase(database));
    setModifications(false);
  }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps

  const fullScreen = (
    <React.Fragment>
      <BasicContainer>
        <Calendar />
      </BasicContainer>
      <Toast ref={toast} />
      <BasicContainer>
        {authType === "bpbadmin" ? <OrderCommandLine /> : ""}
        <CurrentOrderInfo
         
        />
        <CurrentOrderList />
        {!deadlinePassed || authType === "bpbadmin" ? (
          <OrderEntryButtons />
        ) : (
          ""
        )}
      </BasicContainer>
    </React.Fragment>
  );

  const smallScreen = (
    <React.Fragment>
      <Title>Back Porch Bakery</Title>
      <inlineContainer>
        <DateStyle>
          <CustomerGroup
            
          />{" "}
          order for:
        </DateStyle>
        <Calendar />
      </inlineContainer>
      <BasicContainer>
        <Toast ref={toast} />
        {authType === "bpbadmin" ? <OrderCommandLine /> : ""}
        <CurrentOrderInfo
          
        />
        <CurrentOrderList />
        <OrderEntryButtons />
      </BasicContainer>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {largeScreen ? (
        <MainWindow>{fullScreen}</MainWindow>
      ) : (
        <MainWindowPhone>{smallScreen}</MainWindowPhone>
      )}
    </React.Fragment>
  );
}

export default Ordering;
