import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


import { ExpandedWeeklyOrdersRows } from "./ExpandedWeeklyOrdersRows";



export const ExpandedWeeklyRows = ({
  data,
  weeklyInvoices,
  setWeeklyInvoices,
  products,
  pickedProduct,
  setPickedProduct,
  pickedRate,
  setPickedRate,
  pickedQty,
  setPickedQty,
}) => {

  const [expandedRows, setExpandedRows] = useState(null);

  
  let custName = data.custName

  const rowExpansionTemplate = (data) => {
    
    return (
      <ExpandedWeeklyOrdersRows
        data={data}
        custName={custName}
        weeklyInvoices={weeklyInvoices}
        setWeeklyInvoices={setWeeklyInvoices}
        products={products}
        pickedProduct={pickedProduct}
        setPickedProduct={setPickedProduct}
        pickedQty={pickedQty}
        setPickedQty={setPickedQty}
        pickedRate={pickedRate}
        setPickedRate={setPickedRate}
      />
    );
  };
  
  
  return (
    <div className="delivDate-subtable">
      <DataTable
        value={data.delivDate}
        className="p-datatable-sm"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="delivDate"
        
      >
        <Column headerStyle={{ width: "4rem" }}></Column>
        <Column expander style={{ width: "3em" }} />

        <Column field="delivDate" header="Delivery Date" />

       
      </DataTable>
    </div>
  );
};
