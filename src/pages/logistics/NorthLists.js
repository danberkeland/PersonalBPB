import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData, notesData } from "../../helpers/databaseFetchers";
import ComposeNorthList from "./utils/composeNorthList";

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

const compose = new ComposeNorthList();

function NorthList() {
  const { setIsLoading } = useContext(ToggleContext);
  const [croixNorth, setCroixNorth] = useState([]);
  const [shelfProdsNorth, setShelfProdsNorth] = useState([]);
  const [pocketsNorth, setPocketsNorth] = useState([]);
  const [CarltonToPrado, setCarltonToPrado] = useState([]);
  const [Baguettes, setBaguettes] = useState([]);
  const [otherRustics, setOtherRustics] = useState([]);
  const [retailStuff, setRetailStuff] = useState([]);
  const [earlyDeliveries, setEarlyDeliveries] = useState([]);
  const [columnsShelfProdsNorth, setColumnsShelfProdsNorth] = useState([]);
  const [columnsPocketsNorth, setColumnsPocketsNorth] = useState([]);
  const [columnsCarltonToPrado, setColumnsCarltonToPrado] = useState([]);
  const [columnsBaguettes, setColumnsBaguettes] = useState([]);
  const [columnsOtherRustics, setColumnsOtherRustics] = useState([]);
  const [columnsRetailStuff, setColumnsRetailStuff] = useState([]);
  const [columnsEarlyDeliveries, setColumnsEarlyDeliveries] = useState([]);
  const [notes, setNotes] = useState([])

  let delivDate = todayPlus()[0];

  const createDynamic = (cols) => {
    const dynamicColumns = cols.map((col, i) => {
      return (
        <Column
          npmkey={col.field}
          field={col.field}
          header={col.header}
          key={col.field}
          style={col.width}
        />
      );
    });
    return dynamicColumns;
  };

  const dynamicColumnsShelfProdsNorth = createDynamic(columnsShelfProdsNorth);
  const dynamicColumnsPocketsNorth = createDynamic(columnsPocketsNorth);
  const dynamicColumnsCarltonToPrado = createDynamic(columnsCarltonToPrado);
  const dynamicColumnsBaguettes = createDynamic(columnsBaguettes);
  const dynamicColumnsOtherRustics = createDynamic(columnsOtherRustics);
  const dynamicColumnsRetailStuff = createDynamic(columnsRetailStuff);
  const dynamicColumnsEarlyDeliveries = createDynamic(columnsEarlyDeliveries);

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherMakeInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    notesData(setIsLoading).then((notes) =>
      setNotes(notes.filter(note => note.when === convertDatetoBPBDate(delivDate)))
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherMakeInfo = (database) => {
    let northData = compose.returnNorthBreakDown(delivDate, database);
    setCroixNorth(northData.croixNorth);
    setShelfProdsNorth(northData.shelfProdsNorth);
    setPocketsNorth(northData.pocketsNorth);
    setCarltonToPrado(northData.CarltonToPrado);
    setBaguettes(northData.Baguettes);
    setOtherRustics(northData.otherRustics);
    setRetailStuff(northData.retailStuff);
    setEarlyDeliveries(northData.earlyDeliveries);
    setColumnsShelfProdsNorth(northData.columnsShelfProdsNorth);
    setColumnsPocketsNorth(northData.columnsPocketsNorth);
    setColumnsCarltonToPrado(northData.columnsCarltonToPrado);
    setColumnsBaguettes(northData.columnsBaguettes);
    setColumnsOtherRustics(northData.columnsOtherRustics);
    setColumnsRetailStuff(northData.columnsRetailStuff);
    setColumnsEarlyDeliveries(northData.columnsEarlyDeliveries);
  };

  const exportNorthListPdf = () => {
    let finalY;
    let pageMargin = 40;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `North Driver ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;
    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Driver Notes`);

    doc.autoTable({
      body: notes,
      theme: 'grid',
        margin: {
          left: 40,
          right: 40,
        },
      columns: [
        { header: "Date", dataKey: "when" },
        { header: "Note", dataKey: "note" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY;
    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Frozen and Baked Croix`);

    doc.autoTable({
      body: croixNorth,
      theme: 'grid',
        margin: {
          left: 40,
          right: 80,
        },
      columns: [
        { header: "Product", dataKey: "prodNick" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });
    if (columnsPocketsNorth.length > 0) {
      finalY = doc.previousAutoTable.finalY;

      doc.setFontSize(titleFont);
      doc.text(pageMargin, finalY + tableToNextTitle, `Pockets North`);

      doc.autoTable({
        body: pocketsNorth,
        theme: 'grid',
        margin: {
          left: 40,
          right: 60,
        },
        columns: columnsPocketsNorth,
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }
    if (columnsShelfProdsNorth.length > 0) {
      finalY = doc.previousAutoTable.finalY;

      doc.setFontSize(titleFont);
      doc.text(pageMargin, finalY + tableToNextTitle, `Shelf Products`);

      doc.autoTable({
        body: shelfProdsNorth,
        theme: 'grid',
        columns: columnsShelfProdsNorth,
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }

    if (columnsCarltonToPrado.length > 0) {
      finalY = doc.previousAutoTable.finalY;

      doc.setFontSize(titleFont);
      doc.text(pageMargin, finalY + tableToNextTitle, `Carlton To Prado`);

      doc.autoTable({
        body: CarltonToPrado,
        theme: 'grid',
        columns: columnsCarltonToPrado,
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }

    doc.save(`LongDriverNorth${delivDate}.pdf`);
  };

  const exportSouthListPdf = () => {
    let finalY;
    let pageMargin = 10;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `North Driver ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;
    if (columnsBaguettes.length > 0) {
      doc.autoTable({
        body: Baguettes,
        theme: 'grid',
        columns: columnsBaguettes,
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }
    if (columnsOtherRustics.length > 0) {
      finalY = doc.previousAutoTable.finalY;

      doc.autoTable({
        pageBreak: "avoid",
        theme: 'grid',
        body: otherRustics,
        columns: columnsOtherRustics,
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }
    if (columnsRetailStuff.length > 0) {
      finalY = doc.previousAutoTable.finalY;

      doc.autoTable({
        body: retailStuff,
        theme: 'grid',
        columns: columnsRetailStuff,
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }
    if (columnsEarlyDeliveries.length > 0) {
      finalY = doc.previousAutoTable.finalY;

      doc.autoTable({
        body: earlyDeliveries,
        theme: 'grid',
        columns: columnsEarlyDeliveries,
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }

    finalY = doc.previousAutoTable.finalY;

    doc.save(`LongDriverSouth${delivDate}.pdf`);
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportNorthListPdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Long Driver North List
        </Button>
        <Button
          type="button"
          onClick={exportSouthListPdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Long Driver South List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>LONG DRIVER</h1>
        <div>{header}</div>
        <h1>AM North Run {convertDatetoBPBDate(delivDate)}</h1>
        <h3>Driver Notes</h3>
        <DataTable value={notes} className="p-datatable-sm">
          <Column field="when" header="Date"></Column>
          <Column field="note" header="Note"></Column>
         
        </DataTable>
        <h3>Frozen and Baked Croix</h3>
        <DataTable value={croixNorth} className="p-datatable-sm">
          <Column field="prodNick" header="Product"></Column>
          <Column field="qty" header="Frozen"></Column>
          <Column field="bakedNorth" header="Baked"></Column>
         
        </DataTable>

        {pocketsNorth.length > 0 && (
          <React.Fragment>
            <h3>Pockets North</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={pocketsNorth}
            >
              {dynamicColumnsPocketsNorth}
            </DataTable>{" "}
          </React.Fragment>
        )}
        {shelfProdsNorth.length > 0 && (
          <React.Fragment>
            <h3>Shelf Products</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={shelfProdsNorth}
            >
              {dynamicColumnsShelfProdsNorth}
            </DataTable>
          </React.Fragment>
        )}

        {CarltonToPrado.length > 0 && (
          <React.Fragment>
            <h3>Carlton To Prado</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={CarltonToPrado}
            >
              {dynamicColumnsCarltonToPrado}
            </DataTable>
          </React.Fragment>
        )}

        {Baguettes.length > 0 && (
          <React.Fragment>
            <h3>Baguettes</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={Baguettes}
            >
              {dynamicColumnsBaguettes}
            </DataTable>
          </React.Fragment>
        )}

        {otherRustics.length > 0 && (
          <React.Fragment>
            <h3>Other Rustics</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={otherRustics}
            >
              {dynamicColumnsOtherRustics}
            </DataTable>
          </React.Fragment>
        )}
        {retailStuff.length > 0 && (
          <React.Fragment>
            <h3>Retail</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={retailStuff}
            >
              {dynamicColumnsRetailStuff}
            </DataTable>
          </React.Fragment>
        )}

        {earlyDeliveries.length > 0 && (
          <React.Fragment>
            <h3>Early Deliveries</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={earlyDeliveries}
            >
              {dynamicColumnsEarlyDeliveries}
            </DataTable>
          </React.Fragment>
        )}
      </WholeBox>
    </React.Fragment>
  );
}

export default NorthList;
