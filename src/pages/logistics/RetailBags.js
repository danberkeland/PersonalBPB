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
  let tomorrow = todayPlus()[1];

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

    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `Retail Bags ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20
    
    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY+tableToNextTitle, `Prep Date: ${convertDatetoBPBDate(tomorrow)}`);

    doc.autoTable({    
      body: retailBags,
      columns: [
        {header: 'Product', dataKey: 'prodName'},
        {header: 'NEED TODAY', dataKey: 'qty'},
        {header: 'PREP FOR TOMORROW', dataKey: 'tomQty'}
      ],
      startY: finalY+titleToNextTable,
      styles: { fontSize: tableFont },
    });

    

    
    doc.save(`RetailBags${delivDate}.pdf`);
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
        
      </ButtonWrapper>
    </ButtonContainer>
  );

  


  return (
    <React.Fragment>
      <WholeBox>
        <h1>Retail Bags for {convertDatetoBPBDate(delivDate)}</h1>
        
        <div>{header}</div>

        
        <h2>Prep Date: {convertDatetoBPBDate(tomorrow)}</h2>
        <DataTable value={retailBags} className="p-datatable-sm">
          <Column field="prodName" header="Product"></Column>
          <Column field="qty" header="NEED TODAY"></Column>
          <Column field="tomQty" header="PREP FOR TOMORROW"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default RetailBags;



