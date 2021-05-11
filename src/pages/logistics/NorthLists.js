import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";


import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
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
  width: 40%;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;

  background: #ffffff;
`;

const compose = new ComposeNorthList();

function NorthList() {

  const { setIsLoading } = useContext(ToggleContext);
  const [croixNorth, setCroixNorth] = useState([]);
  const [shelfProdsNorth, setShelfProdsNorth] = useState([]);
  const [CarltonToPrado, setCarltonToPrado] = useState([]);
  const [Baguettes, setBaguettes] = useState([]);
  const [otherRustics, setOtherRustics] = useState([]);
  const [retailStuff, setRetailStuff] = useState([]);
  const [earlyDeliveries, setEarlyDeliveries] = useState([]);
  const [columnsShelfProdsNorth, setColumnsShelfProdsNorth] = useState([]);
  const [columnsCarltonToPrado, setColumnsCarltonToPrado] = useState([]);
  const [columnsBaguettes, setColumnsBaguettes] = useState([]);
  const [columnsOtherRustics, setColumnsOtherRustics] = useState([]);
  const [columnsRetailStuff, setColumnsRetailStuff] = useState([]);
  const [columnsEarlyDeliveries, setColumnsEarlyDeliveries] = useState([]);


  let delivDate = todayPlus()[0];

  const createColumns = (cols) => {
    let columns = [cols].map((col, i) => {
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
    return columns;
  };

  const dynamicColumnsShelfProdsNorth = columnsShelfProdsNorth.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  const dynamicColumnsCarltonToPrado = columnsCarltonToPrado.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  const dynamicColumnsBaguettes = columnsBaguettes.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  const dynamicColumnsOtherRustics = columnsOtherRustics.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  const dynamicColumnsRetailStuff = columnsRetailStuff.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  const dynamicColumnsEarlyDeliveries = columnsEarlyDeliveries.map((col, i) => {
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
    promisedData(setIsLoading).then(database => gatherMakeInfo(database));
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherMakeInfo = (database) => {
    let northData = compose.returnNorthBreakDown(database)
    setCroixNorth(northData.croixNorth);
    setShelfProdsNorth(northData.shelfProdsNorth);
    setCarltonToPrado(northData.CarltonToPrado);
    setBaguettes(northData.Baguettes);
    setOtherRustics(northData.otherRustics);
    setRetailStuff(northData.retailStuff);
    setEarlyDeliveries(northData.earlyDeliveries);
    setColumnsShelfProdsNorth(northData.columnsShelfProdsNorth);
    setColumnsCarltonToPrado(northData.columnsCarltonToPrado);
    setColumnsBaguettes(northData.columnsBaguettes);
    setColumnsOtherRustics(northData.columnsOtherRustics);
    setColumnsRetailStuff(northData.columnsRetailStuff);
    setColumnsEarlyDeliveries(northData.columnsEarlyDeliveries);
  }

  const exportListPdf = () => {
    let finalY;
    let pageMargin = 10;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `North Driver ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20
    
    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY+tableToNextTitle, `Frozen and Baked Croix`);

    doc.autoTable({    
      body: croixNorth,
      columns: [
        {header: 'Product', dataKey: 'forBake'},
        {header: 'Baked', dataKey: 'baked'},
        {header: 'Frozen', dataKey: 'frozen'},
      ],
      startY: finalY+titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY
    
    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Shelf Products`);

    doc.autoTable({
      body: shelfProdsNorth,
      columns: dynamicColumnsShelfProdsNorth,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Carlton To Prado`);

    doc.autoTable({
      body: CarltonToPrado,
      columns: columnsCarltonToPrado,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Baguettes`);

    doc.autoTable({
      body: Baguettes,
      columns: columnsBaguettes,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Other Stuff`);

    doc.autoTable({
      body: otherRustics,
      columns: columnsOtherRustics,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Retail`);

    doc.autoTable({
      body: retailStuff,
      columns: columnsRetailStuff,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Early Deliveries`);

    doc.autoTable({
      body: earlyDeliveries,
      columns: columnsEarlyDeliveries,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY

    
    doc.save(`LongDriver${delivDate}.pdf`);
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
          Print Long Driver Lists
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
        <h3>Frozen and Baked Croix</h3>
        <DataTable value={croixNorth} className="p-datatable-sm">
          <Column field="prodName" header="Product"></Column>
          <Column field="frozen" header="Frozen"></Column>
          <Column field="baked" header="Baked"></Column>
        </DataTable>

        <h3>Shelf Products</h3>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={shelfProdsNorth}
        >
          {dynamicColumnsShelfProdsNorth}
        </DataTable>
        
        <h3>Carlton To Prado</h3>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={CarltonToPrado}
        >
          {dynamicColumnsCarltonToPrado}
        </DataTable>

        <h3>Baguettes</h3>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={Baguettes}
        >
          {dynamicColumnsBaguettes}
        </DataTable>

        <h3>Other Rustics</h3>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={otherRustics}
        >
          {dynamicColumnsOtherRustics}
        </DataTable>

        <h3>Retail</h3>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={retailStuff}
        >
          {dynamicColumnsRetailStuff}
        </DataTable>


        <h3>Early Deliveries</h3>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={earlyDeliveries}
        >
          {dynamicColumnsEarlyDeliveries}
        </DataTable>
        
      </WholeBox>
    </React.Fragment>
  );
}

export default NorthList;
