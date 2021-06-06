import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeWhatToBake from "./BPBNSetOutUtils/composeWhatToBake";

import BPBNBaker1Dough from "./BPBNBaker1Dough";
import BPBNBaker1WhatToPrep from "./BPBNBaker1WhatToPrep.js";

import { ExportPastryPrepPdf } from "./BPBNBaker1Parts/ExportPastryPrepPdf";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
`;

const ButtonWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 60%;
  flex-direction: row;
  justify-content: space-between;
  align-content: left;

  background: #ffffff;
`;

const compose = new ComposeWhatToBake();

function BPBNBaker1() {
  const { setIsLoading } = useContext(ToggleContext);
  const [whatToMake, setWhatToMake] = useState([]);
  const [whatToPrep, setWhatToPrep] = useState([]);
  const [doughs, setDoughs] = useState([]);
  const [doughComponents, setDoughComponents] = useState([]);
  const [bagAndEpiCount, setBagAndEpiCount] = useState([]);
  const [oliveCount, setOliveCount] = useState([]);
  const [bcCount, setBcCount] = useState([]);
  const [bagDoughTwoDays, setBagDoughTwoDays] = useState([]);

  let delivDate = todayPlus()[0];

  let infoWrap = {
    whatToMake,
    whatToPrep,
    setBagAndEpiCount,
    oliveCount,
    bcCount,
    bagDoughTwoDays,
  };

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherWhatToMakeInfo(database)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToMakeInfo = (database) => {
    let whatToMakeData = compose.returnWhatToMakeBreakDown(delivDate, database);
    setWhatToMake(whatToMakeData.whatToMake);
  };

  const handlePrint = () => {
    ExportPastryPrepPdf(delivDate, doughs, infoWrap)
  }

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={handlePrint}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print AM Bake List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>What To Bake {convertDatetoBPBDate(delivDate)}</h1>
        <div>{header}</div>

        <DataTable value={whatToMake} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
          <Column field="shaped" header="Shaped"></Column>
          <Column field="short" header="Short"></Column>
          <Column field="needEarly" header="Need Early"></Column>
        </DataTable>
      </WholeBox>
      <BPBNBaker1WhatToPrep
        whatToPrep={whatToPrep}
        setWhatToPrep={setWhatToPrep}
      />
      <BPBNBaker1Dough
        doughs={doughs}
        setDoughs={setDoughs}
        doughComponents={doughComponents}
        setDoughComponents={setDoughComponents}
        bagAndEpiCount={bagAndEpiCount}
        setBagAndEpiCount={setBagAndEpiCount}
        oliveCount={oliveCount}
        setOliveCount={setOliveCount}
        bcCount={bcCount}
        setBcCount={setBcCount}
        bagDoughTwoDays={bagDoughTwoDays}
        setBagDoughTwoDays={setBagDoughTwoDays}
      />
    </React.Fragment>
  );
}

export default BPBNBaker1;
