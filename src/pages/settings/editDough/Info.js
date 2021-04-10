import React, { useContext } from "react";

import styled from "styled-components";

import { ToggleContext } from "../../../dataContexts/ToggleContext";


const clonedeep = require("lodash.clonedeep");

const DuoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 20px 0;
`;

const WeekWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  margin: 0 0 30px 0;
`;


const Info = ({ selectedDough, setSelectedDough, doughs, setDoughs }) => {
  let { setIsLoading } = useContext(ToggleContext);

  

  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-map"></i> Dough Info
      </h2>

      
    </React.Fragment>
  );
};

export default Info;
