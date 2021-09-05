import React from "react";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";

const TotalContainer = styled.div`
  font-weight: bold;
  color: red;
`;

const Total = ({ order }) => {

  return (
    <TotalContainer>
      <label key={uuidv4() + "d"}>
        {order["SO"] === order["qty"] ? "" : order["SO"]}
      </label>
    </TotalContainer>
  );
};

export default Total;