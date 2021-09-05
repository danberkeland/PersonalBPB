import React from "react";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";

const RateContainer = styled.div`
  font-weight: bold;
  color: red;
`;

const Rate = ({ order }) => {

  return (
    <RateContainer>
      <label key={uuidv4() + "d"}>
        {order["SO"] === order["qty"] ? "" : order["SO"]}
      </label>
    </RateContainer>
  );
};

export default Rate;