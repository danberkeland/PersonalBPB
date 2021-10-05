import React from "react";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";

const PreviousContainer = styled.div`
 
  text-decoration: line-through;
  color: red;
`;

const Previous = ({ order }) => {

  return (
    <PreviousContainer>
      <label key={uuidv4() + "d"}>
        {order["SO"] === order["qty"] ? "" : order["SO"]}
      </label>
    </PreviousContainer>
  );
};

export default Previous;
