import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";

import { ToggleContext } from "../../dataContexts/ToggleContext";
import ToolBar from "../logistics/ByRoute/Parts/ToolBar";

import { updateProduct } from "../../graphql/mutations";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeWhatToMake from "./BPBSWhatToMakeUtils/composeWhatToMake";

import styled from "styled-components";
import { ProductsContext } from "../../dataContexts/ProductsContext";

import { API, graphqlOperation } from "aws-amplify";

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

let today = todayPlus()[0];

const clonedeep = require("lodash.clonedeep");

const { DateTime } = require("luxon");

const compose = new ComposeWhatToMake();

function BPBSWhatToMake() {
  const { setIsLoading } = useContext(ToggleContext);
  const { products, setProducts } = useContext(ProductsContext);
  const [youllBeShort, setYoullBeShort] = useState();
  const [freshProds, setFreshProds] = useState();
  const [delivDate, setDelivDate] = useState(todayPlus()[1]);
  const [shelfProds, setShelfProds] = useState();
  const [freezerProds, setFreezerProds] = useState();
  const [pocketsNorth, setPocketsNorth] = useState();

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherMakeInfo(database));
  }, [delivDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherMakeInfo = (database) => {
    let makeData = compose.returnMakeBreakDown(database, delivDate);
    setYoullBeShort(makeData.youllBeShort);
    setPocketsNorth(makeData.pocketsNorth);
    setFreshProds(makeData.freshProds);
    setShelfProds(makeData.shelfProds);
    setFreezerProds(makeData.freezerProds);
    setProducts(database[0])
  };

  const checkDateAlert = (delivDate) => {
    if (delivDate !== today) {
      confirmDialog({
        message:
          "This is not the list for TODAY.  Are you sure this is the one you want to print?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => exportListPdf(),
      });
    } else {
      exportListPdf();
    }
  };

  const exportListPdf = () => {
    let finalY;
    let pageMargin = 40;
    let tableToNextTitle = 8;
    let titleToNextTable = tableToNextTitle;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `What to Make ${convertDatetoBPBDate(delivDate)}`);

    finalY = 10;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: youllBeShort,
      margin: pageMargin,
      columns: [
        { header: "Pocket Size", dataKey: "pocketWeight" },
        { header: "Available", dataKey: "prepreshaped" },
        { header: "Need Today", dataKey: "need" },
        
      ],
      startY: finalY + 20,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: pocketsNorth,
      margin: pageMargin,
      columns: [
        { header: "Pockets North", dataKey: "forBake" },
        { header: "Quantity", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: freshProds,
      margin: pageMargin,
      columns: [
        { header: "Fresh Product", dataKey: "forBake" },
        { header: "Total Deliv", dataKey: "qty" },
        { header: "Make Total", dataKey: "makeTotal" },
        { header: "Bag For Tomorrow", dataKey: "bagEOD" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: shelfProds,
      margin: pageMargin,
      columns: [
        { header: "Shelf Product", dataKey: "forBake" },
        { header: "Total Deliv", dataKey: "qty" },
        { header: "Need Early", dataKey: "needEarly" },
        { header: "Make Total", dataKey: "makeTotal" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: freezerProds,
      margin: pageMargin,
      columns: [
        { header: "Freezer Product", dataKey: "forBake" },
        { header: "Total Deliv", dataKey: "qty" },
        { header: "Need Early", dataKey: "needEarly" },
        { header: "Make Total", dataKey: "makeTotal" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    doc.save(`BPBS_Baker1_${delivDate}.pdf`);
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={(e) => checkDateAlert(delivDate)}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print What To Make List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  const handlePockChange = async (e2,e) => {
   
    let prodsToMod = clonedeep(products);
    let YoullBeCopy = clonedeep(youllBeShort)
    
    let ind = YoullBeCopy.findIndex(yo => yo.pocketWeight === e.pocketWeight)
    YoullBeCopy[ind].makeTotal = Number(e2.target.value)
    YoullBeCopy[ind].short = 0 - Number(e2.target.value) 
    YoullBeCopy[ind].preshaped = YoullBeCopy[ind].need + Number(e2.target.value)
    console.log(YoullBeCopy)
    setYoullBeShort(YoullBeCopy)

    for (let prod of prodsToMod) {
      let weight = e.pocketWeight
     
      if (
        Number(prod.weight) === Number(weight) &&
        prod.doughType === "French"
      ) {
        
        let itemUpdate = {
          id: prod.id,
          preshaped: YoullBeCopy[ind].preshaped
        };

        try {
          await API.graphql(
            graphqlOperation(updateProduct, { input: { ...itemUpdate } })
          );
        } catch (error) {
          console.log("error on updating product", error);
        }
      }
    }
    setProducts(prodsToMod);
  };

  const handlePocketInput = (e) => {
    
    return (
      <InputText
        id={e.pocketWeight}
        style={{
          width: "50px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
        }}
        placeholder={e.makeTotal}
        onKeyUp={(e2) => (e2.code === "Enter" ? handlePockChange(e2,e) : "")}
        onBlur={(e2) => handlePockChange(e2,e)}
      />
    );
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>BPBS What To Make {convertDatetoBPBDate(delivDate)}</h1>
        <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
        <div>{header}</div>

        <React.Fragment>
          <h2>Pocket Count</h2>
          <DataTable value={youllBeShort} className="p-datatable-sm">
            <Column field="pocketWeight" header="Pocket Size"></Column>
            <Column
              field="prepreshaped"
              header="Available"
              
            ></Column>
            <Column field="need" header="Need Today"></Column>
            <Column field="preMakeTotal" header="Surplus(+)/Short(-)" body={(e) => handlePocketInput(e)}></Column>
          </DataTable>
        </React.Fragment>

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
