import React from "react";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";

const RateContainer = styled.div`
  color: black;
`;

const Rate = ({ order,database }) => {
  console.log("order",order)
  const [products, customers, routes, standing, orders] = database;
  let ind = products.findIndex(prod => prod.prodName === order.prodName)
  let price = products[ind].wholePrice
  console.log("ind",ind)
  return (
    <RateContainer>
      <label key={uuidv4() + "d"}>
        $ {price.toFixed(2)}
      </label>
    </RateContainer>
  );
};

export default Rate;