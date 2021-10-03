import React from "react";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";
import { getRate } from "../../../../../helpers/billingGridHelpers"

const TotalContainer = styled.h3`
 
 color: rgb(88, 96, 115);
`;


const Total = ({ order, database }) => {
 
  const [products, customers, routes, standing, orders,d,dd, altPricing] = database;
  let price = getRate(products,order, altPricing)
  price = price*order.qty
  
  return (
   
      <TotalContainer key={uuidv4() + "d"}>
        {price.toFixed(2)}
      </TotalContainer>
    
  );
};

export default Total;