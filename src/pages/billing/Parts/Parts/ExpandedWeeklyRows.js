import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { formatter } from "../../../../helpers/billingGridHelpers";

const clonedeep = require("lodash.clonedeep");

export const ExpandedWeeklyRows = ({
  data,
  dailyInvoices,
  setDailyInvoices,
  products,
  pickedProduct,
  setPickedProduct,
  pickedRate,
  setPickedRate,
  pickedQty,
  setPickedQty,
}) => {
  const deleteItem = (data, invNum) => {
    let invToModify = clonedeep(dailyInvoices);
    let ind = invToModify.findIndex((inv) => inv["invNum"] === invNum);
    let prodInd = invToModify[ind].orders.findIndex(
      (ord) => ord["prodName"] === data["prodName"]
    );
    invToModify[ind].orders[prodInd]["qty"] = 0;
    setDailyInvoices(invToModify);
  };

  const deleteTemplate = (data, invNum) => {
    return (
      <Button
        icon="pi pi-times-circle"
        onClick={(e) => deleteItem(data, invNum)}
      />
    );
  };
  
  const createDate = (e) => {
      console.log(e)
  }

  return (
    <div className="delivDate-subtable">
     
      <DataTable value={data.delivDate} className="p-datatable-sm">
      <Column
          headerStyle={{ width: "4rem" }}
         
        ></Column>
        <Column field="delivDate"  header="Delivery Date"></Column>
        
      </DataTable>
    </div>
  );
};
