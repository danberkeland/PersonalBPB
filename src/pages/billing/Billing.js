import React, { useEffect, useContext, useState } from "react";

import styled from "styled-components";

import BillingGrid from "./Parts/BillingGrid";
import SelectDate from "./Parts/SelectDate";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { promisedData } from "../../helpers/databaseFetchers";
import { listZones } from "../../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { useParams } from "react-router";

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  border: 1px solid lightgray;
  padding: 5px 10px;
  margin: 0px auto;
  box-sizing: border-box;
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

function Billing() {
  let { reload, setIsLoading } = useContext(ToggleContext);

  const [nextInv, setNextInv] = useState(0);
  const [dailyInvoices, setDailyInvoices] = useState([]);
  const [zones, setZones] = useState([]);
  const [database, setDatabase] = useState([]);

  const {code } = useParams();

  useEffect(() => {
    promisedData(setIsLoading).then((database) => setDatabase(database));
  }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log("props", code)
    setIsLoading(true);
    fetchZones();
    
  }, []);


  const fetchZones = async () => {
    try {
      let zones = await fetchInfo(listZones, "listZones", "50");
      setZones(zones);
    } catch (error) {
      console.log("error on fetching Zone List", error);
    }
  };

  return (
    <React.Fragment>
      {code}
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
