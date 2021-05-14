import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";


import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeRetailBags from "./utils/composeRetailBags";

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

const compose = new ComposeRetailBags();

function RetailBags() {

  const { setIsLoading } = useContext(ToggleContext);
  const [retailBags, setRetailBags] = useState();

  let delivDate = todayPlus()[0];

  useEffect(() => {
    promisedData(setIsLoading).then(database => gatherRetailBagInfo(database));
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherRetailBagInfo = (database) => {
    let retailBagData = compose.returnRetailBags(database)
   
    setRetailBags(retailBagData.retailBags);
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
    doc.text(pageMargin, 20, `Retail Bags ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20
    
    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY+tableToNextTitle, `Retail Bag Quantities`);

    doc.autoTable({    
      body: retailBags,
      columns: [
        {header: 'Product', dataKey: 'prodName'},
        {header: 'Quantity', dataKey: 'qty'}
      ],
      startY: finalY+titleToNextTable,
      styles: { fontSize: tableFont },
    });

    

    
    doc.save(`RetailBags${delivDate}.pdf`);
  };

  const exportTestSticker = () => {
    
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format:[4,2]
    });
    doc.setFontSize(20);
    doc.text(5, 5, `Test Sticker`);

    
    
    doc.save(`TestSticker.pdf`);
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
          Print Retail Bag List
        </Button>
        <Button
          type="button"
          onClick={exportTestSticker}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Retail Bag List
        </Button>   
      </ButtonWrapper>
    </ButtonContainer>
  );

  


  return (
    <React.Fragment>
      <WholeBox>
        <h1>Retail Bags for {convertDatetoBPBDate(delivDate)}</h1>
        <div>{header}</div>

        <h2>Retail Bags</h2>
        <DataTable value={retailBags} className="p-datatable-sm">
          <Column field="prodName" header="Product"></Column>
          <Column field="qty" header="Number of Bags"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default RetailBags;
