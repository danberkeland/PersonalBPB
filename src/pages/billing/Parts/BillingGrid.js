import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import {
  buildCartList,
  buildStandList,
  compileFullOrderList,
} from "../../../helpers/CartBuildingHelpers";

import {
  buildCustList,
  buildInvList,
  attachInvoiceOrders,
  formatter,
} from "../../../helpers/billingGridHelpers";

import { ExpandedBillingRows } from "./Parts/ExpandedBillingRows";
import { DeleteInvoice } from "./Parts/DeleteInvoice";

const BillingGrid = ({
  database,
  nextInv,
  dailyInvoices,
  setDailyInvoices,
  zones,
}) => {
  const [products, customers, routes, standing, orders,d,dd,altPricing] = database;
  const [expandedRows, setExpandedRows] = useState(null);

  const [pickedProduct, setPickedProduct] = useState();
  const [pickedRate, setPickedRate] = useState();
  const [pickedQty, setPickedQty] = useState();

  const { delivDate } = useContext(CurrentDataContext);
  const { setIsLoading, reload, setReload } = useContext(ToggleContext);
 
  useEffect(() => {
    try {
      let buildOrders = buildCartList("*", delivDate, orders);
      let buildStand = buildStandList("*", delivDate, standing);
      let fullOrder = compileFullOrderList(buildOrders, buildStand);

      let custListArray = buildCustList(fullOrder);
      let invList = buildInvList(custListArray, customers, delivDate);
      
      let invOrders = attachInvoiceOrders(
        invList,
        fullOrder,
        products,
        altPricing,
        customers,
        zones,
        "daily"
      );

      setDailyInvoices(invOrders);
      console.log("invOrders",invOrders)
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, database, nextInv, zones]);

  

  const calcSumTotal = (data) => {
    let sum = 0;
    try {
      for (let i of data) {
        sum = sum + Number(i.qty) * Number(i.rate);
      }
    } catch {
      console.log("No data to calc.");
    }
    sum = formatter.format(sum);

    return <div>{sum}</div>;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <ExpandedBillingRows
        data={data}
        dailyInvoices={dailyInvoices}
        setDailyInvoices={setDailyInvoices}
        products={products}
        altPricing={altPricing}
        pickedProduct={pickedProduct}
        setPickedProduct={setPickedProduct}
        pickedQty={pickedQty}
        setPickedQty={setPickedQty}
        pickedRate={pickedRate}
        setPickedRate={setPickedRate}
        delivDate={delivDate}
        orders={orders}
      />
    );
  };

  return (
    <div className="datatable-rowexpansion-demo">
      <div className="card">
        <DataTable
          value={dailyInvoices}
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
            body={(e) =>
              DeleteInvoice(e.invNum, dailyInvoices, setDailyInvoices,orders, delivDate, setIsLoading, reload, setReload)
            }
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default BillingGrid;
