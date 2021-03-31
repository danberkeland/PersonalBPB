import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { CustomerContext } from "../../../dataContexts/CustomerContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../dataContexts/StandingContext";

import swal from "@sweetalert/with-react";

import {
  buildCartList,
  buildStandList,
  compileFullOrderList,
} from "../../../helpers/CartBuildingHelpers";

import styled from "styled-components";

const FooterGrid = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
`;

const clonedeep = require("lodash.clonedeep");

const BillingGrid = ({ altPricing, nextInv }) => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [invoices, setInvoices] = useState();

  const { delivDate } = useContext(CurrentDataContext);
  const { customers } = useContext(CustomerContext);
  const { products } = useContext(ProductsContext);
  const { orders } = useContext(OrdersContext);
  const { standing } = useContext(StandingContext);

  useEffect(() => {
    try {
      let buildOrders = buildCartList("*", delivDate, orders);
      let buildStand = buildStandList("*", delivDate, standing);
      let fullOrder = compileFullOrderList(buildOrders, buildStand);

      let custList = fullOrder.map((ord) => ord["custName"]);
      let custListSet = new Set(custList);
      let custListArray = Array.from(custListSet);
      let invList = custListArray.map((cust) => ({
        custName: cust,
        invNum: 0,
        orders: [],
      }));
      invList.forEach(
        (inv, index) => (inv.invNum = Number(nextInv) + Number(index))
      );

      for (let inv of invList) {
        let orderClip = fullOrder.filter(
          (ord) => ord["custName"] === inv["custName"]
        );
        for (let ord of orderClip) {
          let ratePull =
            products[
              products.findIndex((prod) => prod["prodName"] === ord["prodName"])
            ].wholePrice;
          for (let alt of altPricing) {
            if (
              alt["custName"] === ord["custName"] &&
              alt["prodName"] === ord["prodName"]
            ) {
              ratePull = alt["wholePrice"];
            }
          }
          let pushBit = {
            prodName: ord["prodName"],
            qty: Number(ord["qty"]),
            rate: ratePull,
          };
          if (pushBit.qty > 0) {
            inv.orders.push(pushBit);
          }
        }
      }
      invList = invList.filter((inv) => inv.orders.length > 0);
      setInvoices(invList);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, nextInv]);


  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })

  const deleteTemplate = (data, invNum) => {
    return <Button icon="pi pi-times-circle" onClick={e => deleteItem(data, invNum)}
    />;
  };

  

  const deleteItem = (data, invNum) => {
    
    let invToModify = clonedeep(invoices);
      let ind = invToModify.findIndex((inv) => inv["invNum"] === invNum);
      let prodInd = invToModify[ind].orders.findIndex(
        (ord) => ord["prodName"] === data["prodName"]
      );
      invToModify[ind].orders[prodInd]["qty"] = 0;
      setInvoices(invToModify);
    
  }


  const deleteInvoiceTemplate = (invNum) => {
    return <Button icon="pi pi-times-circle" onClick={e => deleteCheck(invNum)}
    />;
  };

  const deleteCheck = (invNum) => {
    swal({
      text:
        " Are you sure that you would like to permanently delete this invoice?",
      icon: "warning",
      buttons: ["Yes", "Don't do it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete) {
        deleteInvoice(invNum);
      } else {
        return;
      }
    });
  }

  const deleteInvoice = (invNum) => {
    let invToModify = clonedeep(invoices);
    invToModify = invToModify.filter(inv => inv["invNum"] !== invNum)
    setInvoices(invToModify)
  }

  const calcTotal = (rowData) => {
    let sum = Number(rowData.qty) * Number(rowData.rate);

    sum = formatter.format(sum)
    
    return sum;
  };

  const calcGrandTotal = (data) => {
    let sum = 0;
    for (let i of data) {
      sum = sum + Number(i.qty) * Number(i.rate);
    }

    sum = formatter.format(sum)

    return (
      <FooterGrid>
        <div></div>
        <div></div>
        <div>Grand Total</div>
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

    sum = formatter.format(sum)

    return <div>{sum}</div>;
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
    let val
    data.rate !== e.target.value ? val = e.target.value : val = data.rate
    invToModify[ind].orders[prodInd]["rate"] = Number(val);
    setInvoices(invToModify);
  };


  const changeRate = (data, invNum) => {
    
    return (
      <InputNumber
        placeholder={data.rate}
        value={data.rate}
        size="4"
        mode="decimal" locale="en-US" minFractionDigits={2}
        onKeyDown={(e) => handleRateChange(e, data, invNum)}
        onBlur={(e) => handleRateBlurChange(e, data, invNum)}
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
    let val
    data.qty !== e.target.value ? val = e.target.value : val = data.qty
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

  const rowExpansionTemplate = (data) => {
    return (
      <div className="orders-subtable">
        <h2>
          Invoice #{data.invNum} for {data.custName}
        </h2>
        <DataTable
          value={data.orders}
          footer={calcGrandTotal(data.orders)}
          className="p-datatable-sm"
        >
          <Column
            headerStyle={{ width: "4rem" }}
            body={e => deleteTemplate(e, data.invNum)}
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

  return (
    <div className="datatable-rowexpansion-demo">
      <div className="card">
        <DataTable
          value={invoices}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="invNum"
          className="p-datatable-sm"
        >
          <Column expander style={{ width: "3em" }} />
          <Column field="invNum" header="Invoice#" />
          <Column field="custName" header="Customer" />
          <Column header="total" body={(e) => calcSumTotal(e.orders)} />

          <Column
            headerStyle={{ width: "4rem" }}
            body={e => deleteInvoiceTemplate(e.invNum)}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default BillingGrid;
