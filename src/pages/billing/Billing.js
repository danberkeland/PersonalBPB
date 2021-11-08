import React, { useEffect, useContext, useState } from "react";

import styled from "styled-components";

import BillingGrid from "./Parts/BillingGrid";
import SelectDate from "./Parts/SelectDate";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { promisedData, fetchZones } from "../../helpers/databaseFetchers";

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
  let { reload, setIsLoading } = useContext(ToggleContext);

  const [nextInv, setNextInv] = useState(0);
  const [dailyInvoices, setDailyInvoices] = useState([]);
  const [zones, setZones] = useState([]);
  const [database, setDatabase] = useState([]);

  useEffect(() => {
    promisedData(setIsLoading).then((database) => setDatabase(database));
  }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsLoading(true);
    fetchZones().then((getZones) => setZones(getZones));
  }, []);

  return (
    <React.Fragment>
      <BasicContainer>
        <h1>Billing</h1>
      </BasicContainer>

      <BasicContainer>
        <SelectDate
          database={database}
          nextInv={nextInv}
          setNextInv={setNextInv}
          dailyInvoices={dailyInvoices}
          setDailyInvoices={setDailyInvoices}
        />
      </BasicContainer>

      <BasicContainer>
        <h2>Daily Invoicing</h2>
        <BillingGrid
          database={database}
          nextInv={nextInv}
          dailyInvoices={dailyInvoices}
          setDailyInvoices={setDailyInvoices}
          zones={zones}
        />
      </BasicContainer>
    </React.Fragment>
  );
}

export default Billing;
