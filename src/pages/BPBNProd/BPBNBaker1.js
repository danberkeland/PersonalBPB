import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeWhatToBake from "./BPBNSetOutUtils/composeWhatToBake";

import BPBNBaker1Dough from "./BPBNBaker1Dough"
import BPBNBaker1WhatToPrep from "./BPBNBaker1WhatToPrep.js"


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

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherWhatToMakeInfo(database)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToMakeInfo = (database) => {
    let whatToMakeData = compose.returnWhatToMakeBreakDown(
      delivDate,
      database
      
    );
    setWhatToMake(whatToMakeData.whatToMake);
    
  };

  const exportPastryPrepPdf = async () => {

    
    let finalY;
    let pageMargin = 20;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(
      pageMargin,
      20,
      `What To Bake ${convertDatetoBPBDate(delivDate)}`
    );

    finalY = 20;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Bake List`);

    doc.autoTable({
      theme: 'grid',
      body: whatToMake,
      margin: pageMargin,
      columns: [
        { header: "Product", dataKey: "forBake" },
        { header: "Qty", dataKey: "qty" },
        { header: "Shaped", dataKey: "shaped" },
        { header: "Short", dataKey: "short" },
        { header: "Need Early", dataKey: "needEarly" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY + tableToNextTitle;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Prep List`);

    doc.autoTable({
      theme: 'grid',
      body: whatToPrep,
      margin: pageMargin,
      columns: [
        { header: "Product", dataKey: "prodName" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    
    doc.save(`WhatToShape${delivDate}.pdf`);
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportPastryPrepPdf}
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
        <h1>
          What To Bake {convertDatetoBPBDate(delivDate)}
        </h1>
        <div>{header}</div>

        <DataTable value={whatToMake} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
          <Column field="shaped" header="Shaped"></Column>
          <Column field="short" header="Short"></Column>
          <Column field="needEarly" header="Need Early"></Column>
        </DataTable>
      </WholeBox>
      <BPBNBaker1WhatToPrep whatToPrep={whatToPrep} setWhatToPrep={setWhatToPrep} />
      <BPBNBaker1Dough doughs={doughs} setDoughs={setDoughs}
        doughComponents={doughComponents} setDoughComponents={setDoughComponents}
        bagAndEpiCount={bagAndEpiCount} setBagAndEpiCount={setBagAndEpiCount}
        oliveCount={oliveCount} setOliveCount={setOliveCount}
        bcCount={bcCount} setBcCount={setBcCount}
        bagDoughTwoDays={bagDoughTwoDays} setBagDoughTwoDays={setBagDoughTwoDays}/>
    </React.Fragment>
  );
}

export default BPBNBaker1;
