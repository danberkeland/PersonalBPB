import React from "react";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";
import { getRate } from "../../../../../helpers/billingGridHelpers"

const RateContainer = styled.div`
  color: black;
`;

const Rate = ({ order,database }) => {
 
  const [products, customers, routes, standing, orders, d,dd, altPricing] = database;
  let price = getRate(products,order, altPricing)
 
  return (
    <RateContainer>
      <label key={uuidv4() + "d"}>
        $ {price.toFixed(2)}/ea.
      </label>
    </RateContainer>
  );
};

export default Rate;