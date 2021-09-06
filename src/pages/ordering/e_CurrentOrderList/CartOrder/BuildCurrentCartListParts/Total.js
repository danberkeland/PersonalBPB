import React from "react";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";

const TotalContainer = styled.div`
  
  color: black;
`;

const Total = ({ order, database }) => {
  console.log("order",order)
  const [products, customers, routes, standing, orders] = database;
  let ind = products.findIndex(prod => prod.prodName === order.prodName)
  let price = products[ind].wholePrice*order.qty
  console.log("ind",ind)
  return (
    <TotalContainer>
      <label key={uuidv4() + "d"}>
        $ {price.toFixed(2)}
      </label>
    </TotalContainer>
  );
};

export default Total;