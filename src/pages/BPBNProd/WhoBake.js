import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposePastryPrep from "./BPBNSetOutUtils/composePastryPrep";

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

function WhoBake({ loc }) {
  const { setIsLoading } = useContext(ToggleContext);
  const [setOut, setSetOut] = useState([]);

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
  };

  const exportPastryPrepPdf = () => {
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

  const productTotal = () => {
    let total = 0;
    for (let prod of setOut) {
      total += prod.qty;
    }

    return total;
  };
  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header="Baguette"
          colSpan={1}
          headerStyle={{ textAlign: "left" }}
        />
      </Row>
    </ColumnGroup>
  );

  let footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Totals:"
          colSpan={1}
          footerStyle={{ textAlign: "right" }}
        />
        <Column footer={productTotal} />
      </Row>
    </ColumnGroup>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>
          {loc} Who Bake {convertDatetoBPBDate(delivDate)}
        </h1>
        <div>{header}</div>

        <DataTable
          value={setOut}
          headerColumnGroup={headerGroup}
          footerColumnGroup={footerGroup}
          className="p-datatable-sm"
        >
          <Column field="prodNick" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default WhoBake;
