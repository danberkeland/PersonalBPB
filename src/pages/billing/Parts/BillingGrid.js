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

const BillingGrid = () => {
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

      console.log(fullOrder);
      let custList = fullOrder.map((ord) => ord["custName"]);
      let custListSet = new Set(custList);
      let custListArray = Array.from(custListSet);
      let invList = custListArray.map((cust) => ({
        custName: cust,
        invNum: 1221,
        orders: [],
      }));
      invList.forEach((inv, index) => (inv.invNum = inv.invNum + index));

      for (let inv of invList) {
        let orderClip = fullOrder.filter(
          (ord) => ord["custName"] === inv["custName"]
        );
        for (let ord of orderClip) {
          let ratePull =
            products[
              products.findIndex((prod) => prod["prodName"] === ord["prodName"])
            ].wholePrice;
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
      invList=invList.filter(inv => inv.orders.length>0)
      setInvoices(invList);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing]);

  const deleteTemplate = () => {
    return <Button icon="pi pi-times-circle" />;
  };

  const calcTotal = (rowData) => {
    let sum = Number(rowData.qty) * Number(rowData.rate);
    sum = formatter.format(sum);
    return sum;
  };

  const calcGrandTotal = (data) => {
    let sum = 0;
    for (let i of data) {
      sum = sum + Number(i.qty) * Number(i.rate);
    }

    sum = formatter.format(sum);

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

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const calcSumTotal = (data) => {
    let sum = 0;
    for (let i of data) {
      sum = sum + Number(i.qty) * Number(i.rate);
    }

    sum = formatter.format(sum);

    return <div>{sum}</div>;
  };

  const changeRate = (data) => {
    let sum = formatter.format(data.rate);
    return (
      <InputNumber
        placeholder={sum}
        size="4"
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const changeQty = (data) => {
    return <InputNumber placeholder={data.qty} size="4" />;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="orders-subtable">
        <h2>Invoice for {data.custName}</h2>
        <DataTable
          value={data.orders}
          footer={calcGrandTotal(data.orders)}
          className="p-datatable-sm"
        >
          <Column
            headerStyle={{ width: "4rem" }}
            body={deleteTemplate}
          ></Column>
          <Column field="prodName" header="Product"></Column>
          <Column header="Quantity" body={changeQty}></Column>
          <Column header="Rate" body={changeRate}>
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
            body={deleteTemplate}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default BillingGrid;
