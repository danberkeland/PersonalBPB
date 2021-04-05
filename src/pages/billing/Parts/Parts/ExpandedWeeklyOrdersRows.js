import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

import { formatter } from "../../../../helpers/billingGridHelpers";

import { WeeklyGrandTotal } from "../Parts/Parts/WeeklyGrandTotal"

const clonedeep = require("lodash.clonedeep");

export const ExpandedWeeklyOrdersRows = ({
  data,
  custName,
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

  const [ needToSave, setNeedToSave ] = useState(false)
  const deleteItem = (data, delivDate) => {
    let invToModify = clonedeep(weeklyInvoices);
    let ind = invToModify.findIndex((inv) => inv["custName"]===custName);
    let nextInd = invToModify[ind].delivDate.findIndex(inv => inv["delivDate"]===delivDate)
    
    let prodInd = invToModify[ind].delivDate[nextInd].orders.findIndex(
      (ord) => ord["prodName"] === data["prodName"]
    );
    invToModify[ind].delivDate[nextInd].orders[prodInd]["qty"] = 0;
    setWeeklyInvoices(invToModify);
    setNeedToSave(true)
  };

  const deleteTemplate = (data, delivDate) => {
    return (
      <Button
        icon="pi pi-times-circle"
        onClick={(e) => deleteItem(data, delivDate)}
      />
    );
  };

  const handleChange = (e, data, delivDate) => {
    if (e.code === "Enter") {
      let invToModify = clonedeep(weeklyInvoices);
      let ind = invToModify.findIndex((inv) => inv["custName"]===custName);
      let nextInd = invToModify[ind].delivDate.findIndex(inv => inv["delivDate"]===delivDate)
    
      let prodInd = invToModify[ind].delivDate[nextInd].orders.findIndex(
        (ord) => ord["prodName"] === data["prodName"]
      );
      invToModify[ind].delivDate[nextInd].orders[prodInd]["qty"] = Number(e.target.value);
      
      setWeeklyInvoices(invToModify);
      setNeedToSave(true)
    }
  };

  const handleBlurChange = (e, data, delivDate) => {
    let invToModify = clonedeep(weeklyInvoices);
    let ind = invToModify.findIndex((inv) => inv["custName"]===custName);
    
    let nextInd = invToModify[ind].delivDate.findIndex(inv => inv["delivDate"]===delivDate)
  
    let prodInd = invToModify[ind].delivDate[nextInd].orders.findIndex(
      (ord) => ord["prodName"] === data["prodName"]
    );
    let val;
    data.rate !== e.target.value ? (val = e.target.value) : (val = data.rate);
    invToModify[ind].delivDate[nextInd].orders[prodInd]["qty"] = Number(val);
    
    setWeeklyInvoices(invToModify);
    setNeedToSave(true)
  };

  const changeQty = (data, delivDate) => {
    return (
      <InputNumber
        placeholder={data.qty}
        value={data.qty}
        size="4"
        onKeyDown={(e) => handleChange(e, data, delivDate)}
        onBlur={(e) => handleBlurChange(e, data, delivDate)}
      />
    );
  };

  const handleRateChange = (e, data, delivDate) => {
    if (e.code === "Enter") {
      let invToModify = clonedeep(weeklyInvoices);
      let ind = invToModify.findIndex((inv) => inv["custName"]===custName);
      let nextInd = invToModify[ind].delivDate.findIndex(inv => inv["delivDate"]===delivDate)
    
      let prodInd = invToModify[ind].delivDate[nextInd].orders.findIndex(
        (ord) => ord["prodName"] === data["prodName"]
      );
      invToModify[ind].delivDate[nextInd].orders[prodInd]["rate"] = e.target.value;
      setWeeklyInvoices(invToModify);
      setNeedToSave(true)
    }
  };

  const handleRateBlurChange = (e, data, delivDate) => {
    let invToModify = clonedeep(weeklyInvoices);
    let ind = invToModify.findIndex((inv) => inv["custName"]===custName);
    let nextInd = invToModify[ind].delivDate.findIndex(inv => inv["delivDate"]===delivDate)
  
    let prodInd = invToModify[ind].delivDate[nextInd].orders.findIndex(
      (ord) => ord["prodName"] === data["prodName"]
    );
    let val;
    data.rate !== e.target.value ? (val = e.target.value) : (val = data.rate);
    invToModify[ind].delivDate[nextInd].orders[prodInd]["rate"] = Number(val);
    setWeeklyInvoices(invToModify);
    setNeedToSave(true)
  };

  const changeRate = (data, delivDate) => {
    return (
      <InputNumber
        placeholder={data.rate}
        value={data.rate}
        size="4"
        mode="decimal"
        locale="en-US"
        minFractionDigits={2}
        onKeyDown={(e) => handleRateChange(e, data, delivDate)}
        onBlur={(e) => handleRateBlurChange(e, data, delivDate)}
      />
    );
  };

  const calcTotal = (rowData) => {
    let sum = Number(rowData.qty) * Number(rowData.rate);

    sum = formatter.format(sum);

    return sum;
  };

  return (
    <div className="orders-subtable">
     
      <DataTable value={data.orders} className="p-datatable-sm">
        <Column
          headerStyle={{ width: "4rem" }}
          body={(e) => deleteTemplate(e, data.delivDate)}
        ></Column>
        <Column field="prodName" header="Product"></Column>
        <Column
          header="Quantity"
          body={(e) => changeQty(e, data.delivDate)}
        ></Column>
        <Column header="Rate" body={(e) => changeRate(e, data.delivDate)}>
          {" "}
        </Column>
        <Column header="Total" body={calcTotal}></Column>
      </DataTable>
      <WeeklyGrandTotal
        rowData={data}
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
        needToSave={needToSave}
        setNeedToSave={setNeedToSave}
      />
    </div>
  );
};
