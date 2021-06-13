import React, { useEffect, useContext, useState } from "react";

import styled from "styled-components";

import BillingGrid from "./Parts/BillingGrid";
import WeeklyBillingGrid from "./Parts/WeeklyBillingGrid";

import SelectDate from "./Parts/SelectDate";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { promisedData } from "../../helpers/databaseFetchers";

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
  let { setIsLoading } = useContext(ToggleContext)

  const [ altPricing, setAltPricing ] = useState()
  const [ nextInv, setNextInv ] = useState(0);
  const [dailyInvoices, setDailyInvoices] = useState([]);
  const [weeklyInvoices, setWeeklyInvoices] = useState([]);
  const [ zones, setZones ] = useState([])
  const [ database, setDatabase ] = useState([])

  useEffect(() => {
    promisedData(setIsLoading).then((database) => setDatabase(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsLoading(true);
    fetchAltPricing();
    fetchZones()
    setIsLoading(false);
  }, []);


  const fetchAltPricing = async () => {
    try {
      let altPricing = await fetchInfo(listAltPricings,"listAltPricings", "1000");
      setAltPricing(altPricing);   
    } catch (error) {
      console.log("error on fetching Alt Pricing List", error);
    }
  };

  const fetchZones = async () => {
    try {
      let zones = await fetchInfo(listZones,"listZones", "50");
      setZones(zones);
    } catch (error) {
      console.log("error on fetching Zone List", error);
    }
  };

  return (
    <React.Fragment>
         
      <BasicContainer>
        <h1>Billing</h1>
      </BasicContainer>
      
      <BasicContainer>
        <SelectDate database={database} nextInv={nextInv} setNextInv={setNextInv} dailyInvoices={dailyInvoices} setDailyInvoices={setDailyInvoices}/>
      </BasicContainer>
     
     

      <BasicContainer>
        <h2>Daily Invoicing</h2>
        <BillingGrid database={database} altPricing={altPricing} nextInv={nextInv} dailyInvoices={dailyInvoices} setDailyInvoices={setDailyInvoices} zones={zones}/>
      </BasicContainer>
      <BasicContainer>
      <h2>Weekly Invoicing (sent Sunday)</h2>
        <WeeklyBillingGrid database={database} altPricing={altPricing} nextInv={nextInv} weeklyInvoices={weeklyInvoices} setWeeklyInvoices={setWeeklyInvoices} zones={zones}/>
      </BasicContainer>
    </React.Fragment>
  );
}

export default Billing;
