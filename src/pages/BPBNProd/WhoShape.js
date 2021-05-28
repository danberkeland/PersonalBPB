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
import ComposeAllOrders from "./BPBNSetOutUtils/composeAllOrders";

import styled from "styled-components";
import { sortAtoZDataByIndex } from "../../helpers/sortDataHelpers";

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

const compose = new ComposeAllOrders();

function WhoBake() {
  const { setIsLoading } = useContext(ToggleContext);
  const [allOrders, setAllOrders] = useState([]);

  let delivDate = todayPlus()[1];

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherAllOrdersInfo(database)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherAllOrdersInfo = (database) => {
    let allOrdersData = compose.returnAllOrdersBreakDown(
      delivDate,
      database,
      "Carlton"
    );
    setAllOrders(allOrdersData.allOrders);
  };
  const exportWhoBakePdf = () => {
    let finalY;
    let pageMargin = 20;
    let tableToNextTitle = 5;
    let titleToNextTable = tableToNextTitle + 3;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(
      pageMargin,
      20,
      `Who Bake ${convertDatetoBPBDate(delivDate)}`
    );

    finalY = 20;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Set Out`);
    for (let ord of allOrdersList) {
    doc.autoTable({
      body: allOrders.filter((fil) => fil.forBake === ord),
      margin: pageMargin,
      columns: [
        { header: ord, dataKey: "custName" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY;
  }
    doc.save(`WhoBake${delivDate}.pdf`);
  };
  
  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportWhoBakePdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Who Shape
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );
    
  
  
  let allOrdersList = allOrders.map((all) => all.forBake).filter(all => all !== null)
  allOrdersList = sortAtoZDataByIndex(
    Array.from(new Set(allOrdersList))
  );

  const footerGroup = (e) => {
    let total = 0;
    for (let prod of e) {
      total += prod.qty;
    }

    return (
      <ColumnGroup>
        <Row>
          <Column
            footer="Total:"
            colSpan={1}
            footerStyle={{ textAlign: "right" }}
          />
          <Column footer={total} />
        </Row>
      </ColumnGroup>
    );
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>
          Who Shape {convertDatetoBPBDate(delivDate)}
        </h1>
        {/*<div>{header}</div>*/}
        {allOrdersList && allOrdersList.map((all) => (
          <React.Fragment>
          <h3>{all}</h3>
          <DataTable
            value={allOrders.filter((fil) => fil.forBake === all)}
            
            className="p-datatable-sm"
            footerColumnGroup={footerGroup(
              allOrders.filter((fil) => fil.forBake === all)
            )}
          >
            <Column field="custName" header="Customer"></Column>
            <Column field="qty" header="Qty"></Column>
          </DataTable>
          </React.Fragment>
        ))}
      </WholeBox>
    </React.Fragment>
  );
}

export default WhoBake;
