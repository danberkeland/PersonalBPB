import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ToolBar from "../logistics/ByRoute/Parts/ToolBar"

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeWhatToBakeBackup from "./Utils/composeWhatToBakeBackup";

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

const WholeBoxPhone = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
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



const doobieStuff = [
  { Prod: "Doobie Buns", Bucket: "YES", Mix: "NO", Bake: "NO" },
  { Prod: "Siciliano", Bucket: "YES", Mix: "NO", Bake: "YES" },
];

const compose = new ComposeWhatToBakeBackup();

function BPBNBaker1Backup() {
  const [delivDate, setDelivDate] = useState(todayPlus()[1]);
  const { setIsLoading } = useContext(ToggleContext);
  const [whatToMake, setWhatToMake] = useState();
  const [whatToPrep, setWhatToPrep] = useState();
  const [doughs, setDoughs] = useState([]);
  const [doughComponents, setDoughComponents] = useState([]);
  const [bagAndEpiCount, setBagAndEpiCount] = useState([]);
  const [oliveCount, setOliveCount] = useState([]);
  const [bcCount, setBcCount] = useState([]);
  const [bagDoughTwoDays, setBagDoughTwoDays] = useState([]);
  const [infoWrap, setInfoWrap] = useState({});


  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  useEffect(() => {
    console.log("todayPlus",todayPlus()[1])
    if (todayPlus()[1] === '2021-12-24'){
      setDelivDate('2021-12-25')
    } else {
      setDelivDate(todayPlus()[1])
    }
  },[])

  useEffect(() => {
    setInfoWrap({
      whatToMake: whatToMake,
      whatToPrep: whatToPrep,
      bagAndEpiCount: bagAndEpiCount,
      oliveCount: oliveCount,
      bcCount: bcCount,
      bagDoughTwoDays: bagDoughTwoDays,
    });
  }, [
    whatToMake,
    whatToPrep,
    oliveCount,
    bcCount,
    bagDoughTwoDays,
    bagAndEpiCount,
  ]);

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherWhatToMakeInfo(database)
    );
  }, [delivDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToMakeInfo = (database) => {
    let whatToMakeData = compose.returnWhatToMakeBreakDown(delivDate, database);
    setWhatToMake(whatToMakeData.whatToMake);
  };

  const handlePrint = () => {
    ExportPastryPrepPdf(delivDate, doughs, infoWrap,doobieStuff);
  };

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

  const innards = (
    <React.Fragment>
      <h1>What To Bake {convertDatetoBPBDate(delivDate)}</h1>
      <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
      <div>{width > breakpoint ? header : ''}</div>

      <DataTable value={whatToMake} className="p-datatable-sm">
        <Column field="forBake" header="Product"></Column>
        <Column field="qty" header="Qty"></Column>
        <Column field="shaped" header="Shaped"></Column>
        <Column field="short" header="Short"></Column>
        <Column field="needEarly" header="Need Early"></Column>
      </DataTable>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {width > breakpoint ? (
        <WholeBox>{innards}</WholeBox>
      ) : (
        <WholeBoxPhone>{innards}</WholeBoxPhone>
      )}

      <BPBNBaker1WhatToPrep
        whatToPrep={whatToPrep}
        setWhatToPrep={setWhatToPrep}
        deliv={delivDate}
        doobieStuff = {doobieStuff}
      />
      <BPBNBaker1Dough
        doughs={doughs}
        setDoughs={setDoughs}
        doughComponents={doughComponents}
        setDoughComponents={setDoughComponents}
        setBagAndEpiCount={setBagAndEpiCount}
        setOliveCount={setOliveCount}
        setBcCount={setBcCount}
        setBagDoughTwoDays={setBagDoughTwoDays}
        infoWrap={infoWrap}
        deliv = {delivDate}
      />
    </React.Fragment>
  );
}

export default BPBNBaker1Backup;
