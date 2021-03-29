import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

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

            rate: 65,
            qty: 1,
          },
          {
            id: "1001",
            product: "Croissant",

            rate: 130,
            qty: 2,
          },
        ],
      },
    ]);
  });

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

  

  const rowExpansionTemplate = (data) => {
    return (
      <div className="orders-subtable">
        <h5>Orders for {data.custName}</h5>
        <DataTable value={data.orders}>
          <Column field="product" header="Product"></Column>
          <Column field="qty" header="Quantity"></Column>
          <Column field="rate" header="Rate"></Column>
          <Column field="amount" header="Amount"></Column>
          <Column
            headerStyle={{ width: "4rem" }}
            body={deleteTemplate}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const header = (
    <div className="table-header-container">
      <Button
        icon="pi pi-plus"
        label="Expand All"
        onClick={expandAll}
        className="p-mr-2"
      />
      <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
    </div>
  );

  return (
    <div className="datatable-rowexpansion-demo">
      <div className="card">
        <DataTable
          value={invoices}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
          
        >
          <Column expander style={{ width: "3em" }} />
          <Column field="invNum" header="Invoice#" />
          <Column field="custName" header="Customer" />
          <Column field="total" header="Total" />
          
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
