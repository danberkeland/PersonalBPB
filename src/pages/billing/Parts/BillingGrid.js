import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

import styled from "styled-components";

const FooterGrid = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  
  
`;

const BillingGrid = () => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    setInvoices([
      {
        id: 1,
        invNum: "1000",
        custName: "Kreuzberg",
        total: 100.5,
        orders: [
          {
            id: "1000",
            product: "Baguette",

            rate: 1.5,
            qty: 16,
          },
          {
            id: "1001",
            product: "Croissant",

            rate: 5.22,
            qty: 24,
          },
        ],
      },
    ]);
  },[]);

  const expandAll = () => {
    let _expandedRows = {};
    invoices.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  
  

  const deleteTemplate = () => {
    return <Button icon="pi pi-times-circle" />;
  };

  const calcTotal = (rowData) => {
    return Number(rowData.qty)*Number(rowData.rate)
  }


  const calcGrandTotal = (data) => {
    let sum = 0;
    for (let i of data) {
      sum = sum + Number(i.qty) * Number(i.rate);
    }

    return (
      <FooterGrid>
        <div></div>
        <div></div>
        <div>
            Grand Total
        </div>
        <div>{sum}</div>
        <div></div>
      </FooterGrid>
    );
  };

  const calcSumTotal = (data) => {
    let sum = 0;
    for (let i of data) {
      sum = sum + Number(i.qty) * Number(i.rate);
    }

    return (
      
        <div>{sum}</div>
        
    );
 
  }

  const changeRate = (data) => {
    return (
      <InputNumber placeholder = {data.qty} size="4" mode="currency" currency="USD" locale="en-US"/>
    )
  }

  const changeQty = (data) => {
    return (
      <InputNumber placeholder = {data.qty} size="4" />
    )
  }


  const rowExpansionTemplate = (data) => {
    return (
      <div className="orders-subtable">
        <h2>Invoice for {data.custName}</h2>
        <DataTable value={data.orders} footer={calcGrandTotal(data.orders)} className="p-datatable-sm">
          <Column field="product" header="Product"></Column>
          <Column header="Quantity" body={changeQty}></Column>
          <Column header="Rate" body={changeRate} ></Column>
          <Column header="Total" body={calcTotal}></Column>
          <Column
            headerStyle={{ width: "4rem" }}
            body={deleteTemplate}
          ></Column>
        </DataTable>
      </div>
    );
  };


  return (
    <div className="datatable-rowexpansion-demo">
      <div className="card">
        <DataTable
          value={invoices}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
          className="p-datatable-sm"
          
        >
          <Column expander style={{ width: "3em" }} />
          <Column field="invNum" header="Invoice#" />
          <Column field="custName" header="Customer" />
          <Column header = "total" body={e => calcSumTotal(e.orders)} />
          
          <Column
            headerStyle={{ width: "4rem" }}
            body={deleteTemplate}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default BillingGrid;
