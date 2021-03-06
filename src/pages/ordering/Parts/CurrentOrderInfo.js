import React, { useState } from "react";

import TitleBox from "./CurrentOrderInfoParts/TitleBox";
import CustomerGroup from "./CurrentOrderInfoParts/CustomerGroup";
import RouteSelect from "./CurrentOrderInfoParts/RouteSelect";
import PONote from './CurrentOrderInfoParts/PONote'

import styled from "styled-components";

const CurrentInfo = styled.div`
  width: 100%;
  display: grid;
  margin: 10px 0;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 10px;
  background-color: lightgrey;
`;

const SpecialInfo = styled.div`
  width: 100%;
  display: flex;
  margin: 0px 10px 10px 10px;
`;

const FulfillOptions = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr 3fr 1fr 3fr 1fr 3fr;
  margin: 10px;
  align-items: center;
  justify-items: left;
`;

const CurrentOrderInfo = ({ database, setDatabase }) => {

  const [products, customers, routes, standing, orders] = database;

  const [ customerGroup, setCustomerGroup ] = useState(customers)

  return (
    <React.Fragment>
      <TitleBox />

      <CurrentInfo>
        <FulfillOptions>
          <CustomerGroup database={database} customerGroup={customerGroup} setCustomerGroup={setCustomerGroup}/>
          <RouteSelect database={database} setDatabase={setDatabase} customerGroup={customerGroup} />
        </FulfillOptions>

        <SpecialInfo>
          <PONote database={database} setDatabase={setDatabase}/>
        </SpecialInfo>
      </CurrentInfo>
    </React.Fragment>
  );
};

export default CurrentOrderInfo;
