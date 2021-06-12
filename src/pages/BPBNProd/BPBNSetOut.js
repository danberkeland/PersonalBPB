import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposePastryPrep from "./Utils/composePastryPrep";

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

const compose = new ComposePastryPrep();

function BPBNSetOut({ loc }) {
  const { setIsLoading } = useContext(ToggleContext);
  const [setOut, setSetOut] = useState([]);
  const [pastryPrep, setPastryPrep] = useState([]);
  const [almondPrep, setAlmondPrep] = useState([]);

  let delivDate = todayPlus()[0];

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherPastryPrepInfo(database)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherPastryPrepInfo = (database) => {
    let pastryPrepData = compose.returnPastryPrepBreakDown(
      delivDate,
      database,
      loc
    );
    setSetOut(pastryPrepData.setOut);
    setPastryPrep(pastryPrepData.pastryPrep);
    setAlmondPrep(pastryPrepData.almondPrep);
  };

  const exportPastryPrepPdf = async () => {
    console.log(setOut)
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
      `${loc} Pastry Prep ${convertDatetoBPBDate(delivDate)}`
    );

    finalY = 20;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Set Out`);

    doc.autoTable({
      body: setOut,
      margin: pageMargin,
      columns: [
        { header: "Product", dataKey: "prodNick" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.autoTable({
      body: pastryPrep,
      margin: pageMargin,
      columns: [
        { header: "Product", dataKey: "prodNick" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    if (loc === "Prado") {
      finalY = doc.previousAutoTable.finalY;

      doc.autoTable({
        body: almondPrep,
        margin: pageMargin,
        columns: [
          { header: "Product", dataKey: "prodNick" },
          { header: "Qty", dataKey: "qty" },
        ],
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }

    doc.save(`SetOut${loc}${delivDate}.pdf`);
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
          Print {loc} Prep List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>
          {loc} PASTRY PREP {convertDatetoBPBDate(delivDate)}
        </h1>
        <div>{header}</div>

        <h3>Set Out</h3>
        <DataTable value={setOut} className="p-datatable-sm">
          <Column field="prodNick" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
        </DataTable>

        <h3>Pastry Prep</h3>
        <DataTable value={pastryPrep} className="p-datatable-sm">
          <Column field="prodNick" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
        </DataTable>
        {loc === "Prado" && (
          <React.Fragment>
            <h3>Almonds</h3>
            <DataTable value={almondPrep} className="p-datatable-sm">
              <Column field="prodNick" header="Product"></Column>
              <Column field="qty" header="Qty"></Column>
            </DataTable>
          </React.Fragment>
        )}
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNSetOut;
