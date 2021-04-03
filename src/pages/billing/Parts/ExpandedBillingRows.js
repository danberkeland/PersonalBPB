import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

import { formatter } from "../../../helpers/billingGridHelpers";

import { GrandTotal } from './GrandTotal'

const clonedeep = require("lodash.clonedeep");


export const ExpandedBillingRows = (data,invoices,setInvoices, pickedProduct, setPickedProduct) => {

    
const deleteItem = (data, invNum) => {
  let invToModify = clonedeep(invoices);
  let ind = invToModify.findIndex((inv) => inv["invNum"] === invNum);
  let prodInd = invToModify[ind].orders.findIndex(
    (ord) => ord["prodName"] === data["prodName"]
  );
  invToModify[ind].orders[prodInd]["qty"] = 0;
  setInvoices(invToModify);
};

const deleteTemplate = (data, invNum) => {
  return (
    <Button
      icon="pi pi-times-circle"
      onClick={(e) => deleteItem(data, invNum)}
    />
  );
};

const handleChange = (e, data, invNum) => {
  if (e.code === "Enter") {
    let invToModify = clonedeep(invoices);
    let ind = invToModify.findIndex((inv) => inv["invNum"] === invNum);
    let prodInd = invToModify[ind].orders.findIndex(
      (ord) => ord["prodName"] === data["prodName"]
    );
    invToModify[ind].orders[prodInd]["qty"] = Number(e.target.value);
    setInvoices(invToModify);
  }
};

const handleBlurChange = (e, data, invNum) => {
  let invToModify = clonedeep(invoices);
  let ind = invToModify.findIndex((inv) => inv["invNum"] === invNum);
  let prodInd = invToModify[ind].orders.findIndex(
    (ord) => ord["prodName"] === data["prodName"]
  );
  let val;
  data.qty !== e.target.value ? (val = e.target.value) : (val = data.qty);
  invToModify[ind].orders[prodInd]["qty"] = Number(val);
  setInvoices(invToModify);
};

const changeQty = (data, invNum) => {
  return (
    <InputNumber
      placeholder={data.qty}
      value={data.qty}
      size="4"
      onKeyDown={(e) => handleChange(e, data, invNum)}
      onBlur={(e) => handleBlurChange(e, data, invNum)}
    />
  );
};

const handleRateChange = (e, data, invNum) => {
  if (e.code === "Enter") {
    let invToModify = clonedeep(invoices);
    let ind = invToModify.findIndex((inv) => inv["invNum"] === invNum);
    let prodInd = invToModify[ind].orders.findIndex(
      (ord) => ord["prodName"] === data["prodName"]
    );
    invToModify[ind].orders[prodInd]["rate"] = e.target.value;
    setInvoices(invToModify);
  }
};

const handleRateBlurChange = (e, data, invNum) => {
  let invToModify = clonedeep(invoices);
  let ind = invToModify.findIndex((inv) => inv["invNum"] === invNum);
  let prodInd = invToModify[ind].orders.findIndex(
    (ord) => ord["prodName"] === data["prodName"]
  );
  let val;
  data.rate !== e.target.value ? (val = e.target.value) : (val = data.rate);
  invToModify[ind].orders[prodInd]["rate"] = Number(val);
  setInvoices(invToModify);
};

const changeRate = (data, invNum) => {
  return (
    <InputNumber
      placeholder={data.rate}
      value={data.rate}
      size="4"
      mode="decimal"
      locale="en-US"
      minFractionDigits={2}
      onKeyDown={(e) => handleRateChange(e, data, invNum)}
      onBlur={(e) => handleRateBlurChange(e, data, invNum)}
    />
  );
};

const calcTotal = (rowData) => {
  let sum = Number(rowData.qty) * Number(rowData.rate);

  sum = formatter.format(sum);

  return sum;
};


const setupFooter = (data, invNum) => {
  return (
    <React.Fragment>
        <h1>Test</h1>
      <GrandTotal data={data} invNum={invNum} pickedProduct={PickedProduct} setPickedProduct={setPickedProduct}/>
    </React.Fragment>
  );
};


  return (
    <div className="orders-subtable">
      <h2>
        Invoice #{data.invNum} for {data.custName}
      </h2>
      <DataTable
        value={data.orders}
        footer={setupFooter(data.orders,data.invNum)}
        className="p-datatable-sm"
      >
        <Column
          headerStyle={{ width: "4rem" }}
          body={(e) => deleteTemplate(e, data.invNum)}
        ></Column>
        <Column field="prodName" header="Product"></Column>
        <Column
          header="Quantity"
          body={(e) => changeQty(e, data.invNum)}
        ></Column>
        <Column header="Rate" body={(e) => changeRate(e, data.invNum)}>
          {" "}
        </Column>
        <Column header="Total" body={calcTotal}></Column>
      </DataTable>
    </div>
  );
};
