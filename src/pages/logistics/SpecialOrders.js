import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeSpecialOrders from "./utils/composeSpecialOrders";

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
  width: 40%;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;

  background: #ffffff;
`;

const compose = new ComposeSpecialOrders();

function SpecialOrders() {
  const { setIsLoading } = useContext(ToggleContext);
  const [BPBNSpecialOrders, setBPBNSpecialOrders] = useState();
  const [BPBSSpecialOrders, setBPBSSpecialOrders] = useState();
  const [columnsNorth, setColumnsNorth] = useState([]);
  const [columnsSouth, setColumnsSouth] = useState([]);

  let delivDate = todayPlus()[0];

  const dynamicColumnsNorth = columnsNorth.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  const dynamicColumnsSouth = columnsSouth.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherSpecialOrdersInfo(database)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherSpecialOrdersInfo = (database) => {
    let colNorth = compose.returnSpecialNorthColumns(database);
    let colSouth = compose.returnSpecialSouthColumns(database);
    let BPBNSpecials = compose.returnBPBNSpecialOrders(database);
    let BPBSSpecials = compose.returnBPBSSpecialOrders(database);
    setBPBNSpecialOrders(BPBNSpecials.specialOrders);
    setBPBSSpecialOrders(BPBSSpecials.specialOrders);
    setColumnsNorth(colNorth.columns);
    setColumnsSouth(colSouth.columns);
  };

  console.log("BPBN Specials", BPBNSpecialOrders)
  const exportListPdfNorth = () => {
    let finalY;
    let pageMargin = 10;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(20);
    doc.text(
      pageMargin,
      20,
      `BPBN Special Orders ${convertDatetoBPBDate(delivDate)}`
    );

    finalY = 20;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Special Orders`);

    doc.autoTable({
      body: BPBNSpecialOrders,
      columns: columnsNorth,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    doc.save(`BPBNSpecial${delivDate}.pdf`);
  };

  const exportListPdfSouth = () => {
    let finalY;
    let pageMargin = 10;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(20);
    doc.text(
      pageMargin,
      20,
      `BPBS Special Orders ${convertDatetoBPBDate(delivDate)}`
    );

    finalY = 20;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Special Orders`);
    doc.autoTable({
      body: BPBSSpecialOrders,
      columns: columnsSouth,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    doc.save(`BPBSSpecial${delivDate}.pdf`);
  };

  const headerNorth = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportListPdfNorth}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print BPBN Special Orders List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  const headerSouth = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportListPdfSouth}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print BPBN Special Orders List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>Carlton Special Orders for {convertDatetoBPBDate(delivDate)}</h1>
        <div>{headerNorth}</div>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={BPBNSpecialOrders}
        >
          {dynamicColumnsNorth}
        </DataTable>
      </WholeBox>
      <WholeBox>
        <h1>Prado Special Orders for {convertDatetoBPBDate(delivDate)}</h1>
        <div>{headerSouth}</div>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={BPBSSpecialOrders}
        >
          {dynamicColumnsSouth}
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default SpecialOrders;
