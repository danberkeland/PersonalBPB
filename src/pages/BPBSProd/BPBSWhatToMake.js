import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeWhatToMake from "./BPBSWhatToMakeUtils/composeWhatToMake";

import styled from "styled-components";
import react from "react";

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
  width: 40%;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;

  background: #ffffff;
`;

const compose = new ComposeWhatToMake();

function BPBSWhatToMake() {
  const { setIsLoading } = useContext(ToggleContext);
  const [youllBeShort, setYoullBeShort] = useState();
  const [freshProds, setFreshProds] = useState();
  const [shelfProds, setShelfProds] = useState();
  const [freezerProds, setFreezerProds] = useState();
  const [pocketsNorth, setPocketsNorth] = useState();

  let delivDate = todayPlus()[0];

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherMakeInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherMakeInfo = (database) => {
    let makeData = compose.returnMakeBreakDown(database);
    setYoullBeShort(makeData.youllBeShort);
    setPocketsNorth(makeData.pocketsNorth);
    setFreshProds(makeData.freshProds);
    setShelfProds(makeData.shelfProds);
    setFreezerProds(makeData.freezerProds);
  };

  const exportListPdf = () => {
    let finalY;
    let pageMargin = 10;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `What to Make ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;

    if (youllBeShort.length>0) {
      doc.setFontSize(titleFont);
      doc.text(pageMargin, finalY + tableToNextTitle, `You'll Be Short`);

      doc.autoTable({
        body: youllBeShort,
        columns: [
          { header: "Pocket Weight", dataKey: "pocketWeight" },
          { header: "Short", dataKey: "makeTotal" },
        ],
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });

      finalY = doc.previousAutoTable.finalY;
    }

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Pockets North`);

    doc.autoTable({
      body: pocketsNorth,
      columns: [
        { header: "Product", dataKey: "forBake" },
        { header: "Quantity", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Fresh Product`);

    doc.autoTable({
      body: freshProds,
      columns: [
        { header: "Product", dataKey: "forBake" },
        { header: "Total Deliv", dataKey: "qty" },
        { header: "Make Total", dataKey: "makeTotal" },
        { header: "Bag For Tomorrow", dataKey: "bagEOD" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Shelf Product`);

    doc.autoTable({
      body: shelfProds,
      columns: [
        { header: "Product", dataKey: "forBake" },
        { header: "Total Deliv", dataKey: "qty" },
        { header: "Need Early", dataKey: "needEarly" },
        { header: "Make Total", dataKey: "makeTotal" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Freezer Product`);

    doc.autoTable({
      body: freezerProds,
      columns: [
        { header: "Product", dataKey: "forBake" },
        { header: "Total Deliv", dataKey: "qty" },
        { header: "Need Early", dataKey: "needEarly" },
        { header: "Make Total", dataKey: "makeTotal" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    doc.save(`WhatToMake${delivDate}.pdf`);
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportListPdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print What To Make List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>BPBS What To Make {convertDatetoBPBDate(delivDate)}</h1>
        <div>{header}</div>
        {(youllBeShort && youllBeShort.length>0) && (
          <React.Fragment>
            <h2>You'll Be Short</h2>
            <DataTable value={youllBeShort} className="p-datatable-sm">
              <Column field="pocketWeight" header="Pocket Size"></Column>
              <Column field="makeTotal" header="Short"></Column>
            </DataTable>
          </React.Fragment>
        )}

        <h2>Send Pockets North</h2>
        <DataTable value={pocketsNorth} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
        </DataTable>

        <h2>Make Fresh</h2>
        <DataTable value={freshProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
          <Column field="bagEOD" header="Bag for Tomorrow"></Column>
        </DataTable>
        <h2>Make For Shelf</h2>
        <DataTable value={shelfProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="needEarly" header="Need Early"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
        </DataTable>
        <h2>Make For Freezer</h2>
        <DataTable value={freezerProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="needEarly" header="Need Early"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBSWhatToMake;
