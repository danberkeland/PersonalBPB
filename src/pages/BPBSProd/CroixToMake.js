import React, { useState, useEffect, useContext } from "react";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { promisedData } from "../../helpers/databaseFetchers";

import { todayPlus } from "../../helpers/dateTimeHelpers";

import { updateDough } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import jsPDF from "jspdf";
import "jspdf-autotable";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  column-gap: 10px;
  row-gap: 10px;
  padding: 5px;
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr .6fr;
  column-gap: 5px;
  row-gap: 10px;
  padding: 5px;
`;

const BorderBox = styled.div`
  border-style: solid;
  border-width: 1px;
  border-color: grey;`;


const ButtonStyle = styled.button`
  border: 0;
  background-color: #4caf50;
  color: white;
  font-size: 20px;
  border-radius: 15px;
  box-shadow: 0 9px #999;
  &:hover {
    background-color: #3e8e41;
  }
  &:active {
    background-color: #3e8e41;
    box-shadow: 0 5px #666;
    transform: translateY(4px);
  }
`;

const clonedeep = require("lodash.clonedeep");

function CroixToMake() {
  const { setIsLoading } = useContext(ToggleContext);
  const [database, setDatabase] = useState([]);
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [mod,setMod] = useState(false);
  const [modType,setModType] = useState();

  useEffect(() => {
    promisedData(setIsLoading).then((db) => setDatabase(db));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openingCount = [
    {"prod": "pl", "qty": 15},
    {"prod": "ch", "qty": 15},
    {"prod": "pg", "qty": 15},
    {"prod": "sf", "qty": 15},
    {"prod": "mb", "qty": 15},
    {"prod": "mini", "qty": 15}
    
  ]

  const makeCount = [
    {"sheet": 5, "qty": 300},
    {"sheet": 6, "qty": 360},
    {"sheet": 0, "qty": 0},
    {"sheet": 6, "qty": 360},
    {"sheet": 3, "qty": 80},
    {"sheet": 3, "qty": 80}
    
  ]

  const openingHeader = (
    <div>Opening Freezer Count</div>
  );

  const makeHeader = (
    <div>MAKE TODAY</div>
  );

  const closeHeader = (
    <div>Closing EOD</div>
  );

  const projectionHeader = (
    <div>EOD Projections</div>
  );

  const Toggle =(e) => {
    console.log(e)
    let newMod = clonedeep(mod)
    console.log("mod",newMod)
    setMod(!newMod)
  }

  const modify = (
    <Button onClick={e => Toggle(e)}>MODIFY</Button>
  );

  const handleInput = (e) => {
    return (
      <InputText
        
        style={{
          width: "50px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
        }}
        
       
      />
    );
  };


  

  return (
    <React.Fragment>
      <WholeBox>
      <h1>Croissant Production</h1>
        <h2>Sunday, June 20, 2021</h2>
        <TwoColumnGrid>
        <ThreeColumnGrid>
        <BorderBox>
        <DataTable id="openingCount" value={openingCount} header={openingHeader} footer={modify} >
          <Column field="prod" header="Product"></Column>
          {mod ?
            <Column header="Qty" body={(e) => handleInput(e)}></Column> :
            <Column field="qty" header="Qty"></Column> 
          }
        </DataTable>
        </BorderBox>
        <BorderBox>
        <DataTable id="makeCount" value={makeCount} header={makeHeader} footer={modify} >
          <Column field="sheet" header="Sheets" body={(e) => handleInput(e)}></Column>
          <Column field="qty" header="Total"></Column>
        </DataTable>
        </BorderBox>
        <BorderBox>
        <DataTable id="closingCount" value={openingCount} header={closeHeader} footer={modify} >
          <Column field="qty" header="Qty" body={(e) => handleInput(e)}></Column>
        </DataTable>
        </BorderBox>
        </ThreeColumnGrid>
        <BorderBox>
        <DataTable value={openingCount} header={projectionHeader} >
          <Column field="prod" header="Product"></Column>
          <Column field="qty" header="MON"></Column>
          <Column field="qty" header="TUES"></Column>
          <Column field="qty" header="WED"></Column>
          <Column field="qty" header="THURS"></Column>
        </DataTable>
        </BorderBox>
        </TwoColumnGrid>
      </WholeBox>

    </React.Fragment>
  );
}

export default CroixToMake;
