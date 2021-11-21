import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ToolBar from "../logistics/ByRoute/Parts/ToolBar"

import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeWhatToMake from "./Utils/composeWhatToMake";
import ComposePastryPrep from "./Utils/composePastryPrep";
import ComposeWhatToPrep from "./Utils/composeWhatToPrep";

import { updateProduct } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

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

const compose = new ComposeWhatToMake();
const composePastry = new ComposePastryPrep();
const composePrep = new ComposeWhatToPrep();

let finalY;
let pageMargin = 20;
let tableToNextTitle = 4;
let titleToNextTable = tableToNextTitle + 2;
let tableFont = 11;
let titleFont = 14;

const buildTable = (title, doc, body, col) => {
  
  doc.autoTable({
    theme: "grid",
    body: body,
    margin: pageMargin+25,
    columns: col,
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
  });
};

function BPBNBaker2() {
  const { setIsLoading } = useContext(ToggleContext);
  const [setOut, setSetOut] = useState([]);
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [whatToMake, setWhatToMake] = useState([]);
  const [pastryPrep, setPastryPrep] = useState([]);
  const [infoWrap, setInfoWrap] = useState({});
  const [whatToPrep, setWhatToPrep] = useState();


  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherWhatToPrepInfo(database)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToPrepInfo = (database) => {
    let whatToPrepData = composePrep.returnWhatToPrepBreakDown(delivDate, database);
    setWhatToPrep(whatToPrepData.whatToPrep);
  };
  

  useEffect(() => {
    setInfoWrap({
      whatToPrep: whatToPrep,
    });
  }, [whatToPrep]);

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherWhatToMakeInfo(database)
    );
  }, [delivDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToMakeInfo = (database) => {
    let whatToMakeData = compose.returnWhatToMakeBreakDown(database,delivDate);
    setWhatToMake(whatToMakeData.whatToMake);
  };

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherPastryPrepInfo(database)
    );
  }, [delivDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherPastryPrepInfo = (database) => {
    let pastryPrepData = composePastry.returnPastryPrepBreakDown(
      delivDate,
      database,
      "Carlton"
    );
    setSetOut(pastryPrepData.setOut);
    setPastryPrep(pastryPrepData.pastryPrep);
  };

  const exportPastryPrepPdf = async (infoWrap) => {
    setIsLoading(true)
    
    for (let set of setOut) {
      let addDetails = {
        id: set.id,
        prepreshaped: set.qty,
      };
      try {
        await API.graphql(
          graphqlOperation(updateProduct, { input: { ...addDetails } })
        );
      } catch (error) {
        console.log("error on updating product", error);
      }
    }
   
    for (let make of whatToMake) {
      let addDetails = {
        id: make.id,
        prepreshaped: make.qty,
      };
      try {
        await API.graphql(
          graphqlOperation(updateProduct, { input: { ...addDetails } })
        );
      } catch (error) {
        console.log("error on updating product", error);
      }
    }


    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `WhatToMake ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;

    doc.setFontSize(titleFont);
   
    doc.autoTable({
      theme: 'grid',
      body: whatToMake,
      margin: pageMargin,
      columns: [
        { header: "Product", dataKey: "forBake" },
        { header: "Weight", dataKey: "weight" },
        { header: "Dough", dataKey: "dough" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  let col = [
    { header: "Product", dataKey: "prodName" },
    { header: "Qty", dataKey: "qty" },
  ];
  buildTable('',doc, infoWrap.whatToPrep, col);

  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

    doc.autoTable({
      body: setOut,
      margin: pageMargin+25,
      columns: [
        { header: "Set Out", dataKey: "prodNick" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid"
    });
    /*
    finalY = doc.previousAutoTable.finalY;

    doc.autoTable({
      body: pastryPrep,
      margin: pageMargin+25,
      columns: [
        { header: "Pastry Prep", dataKey: "prodNick" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid"
    });
    */
    doc.save(`WhatToShape${delivDate}.pdf`);
    setIsLoading(false)
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={e => exportPastryPrepPdf(infoWrap)}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Prep List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>What To Shape {convertDatetoBPBDate(delivDate)}</h1>
        <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
        <div>{header}</div>

        <h3>What To Shape</h3>
        <DataTable value={whatToMake} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="weight" header="Weight"></Column>
          <Column field="dough" header="Dough"></Column>
          <Column field="qty" header="Qty"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNBaker2;
