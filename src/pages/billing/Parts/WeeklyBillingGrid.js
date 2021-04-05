import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { CustomerContext } from "../../../dataContexts/CustomerContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../dataContexts/StandingContext";

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

import { ExpandedWeeklyRows } from "./Parts/ExpandedWeeklyRows";
import { DeleteInvoice } from "./Parts/DeleteInvoice";


import { API, graphqlOperation } from "aws-amplify";

import { listHeldforWeeklyInvoicings } from "../../../graphql/queries";
import { createHeldforWeeklyInvoicing } from "../../../graphql/mutations";
import { add } from "lodash";

const fetchInfo = async (operation, opString, limit) => {
  try {
    let info = await API.graphql(
      graphqlOperation(operation, {
        limit: limit,
      })
    );
    let list = info.data[opString].items;

    let noDelete = list.filter((li) => li["_deleted"] !== true);
    return noDelete;
  } catch {
    return [];
  }
};

const WeeklyBillingGrid = ({
  altPricing,
  nextInv,
  weeklyInvoices,
  setWeeklyInvoices,
  zones,
}) => {
  const [expandedRows, setExpandedRows] = useState(null);

  const [pickedProduct, setPickedProduct] = useState();
  const [pickedRate, setPickedRate] = useState();
  const [pickedQty, setPickedQty] = useState();

  const { delivDate } = useContext(CurrentDataContext);
  const { products } = useContext(ProductsContext);
  const { customers } = useContext(CustomerContext);
  const { orders } = useContext(OrdersContext);
  const { standing } = useContext(StandingContext);

  useEffect(() => {
    try {
      let buildOrders = buildCartList("*", delivDate, orders);
      let buildStand = buildStandList("*", delivDate, standing);
      let fullOrder = compileFullOrderList(buildOrders, buildStand);

      let custListArray = buildCustList(fullOrder);
      let invList = buildInvList(custListArray, nextInv);
      let invOrders = attachInvoiceOrders(
        invList,
        fullOrder,
        products,
        altPricing,
        customers,
        zones,
        "weekly"
      );

      addOrdersToDB(invOrders);
      setWeeklyInvoices(invOrders);
    } catch {
      console.log("Whoops");
    }
  }, [delivDate, orders, standing, nextInv, zones]);

  useEffect(() => {
    try {
      let ratePull =
        products[
          products.findIndex((prod) => prod["prodName"] === pickedProduct)
        ].wholePrice;

      setPickedRate(ratePull);
    } catch {
      console.log("no product chosen");
    }
  }, [pickedProduct]);

  const addOrdersToDB = async (invOrders) => {
    let thisWeeksOrders;
    // fetch thisWeeksOrders
    try {
      thisWeeksOrders = await fetchInfo(
        listHeldforWeeklyInvoicings,
        "listHeldforWeeklyInvoicings",
        "1000"
      );

      for (let inv of invOrders) {
        if (
          thisWeeksOrders.findIndex(
            (ord) =>
              ord["delivDate"] === delivDate &&
              ord["custName"] === inv["custName"] &&
              inv["custName"] !== ""
          ) < 0
        ) {
          for (let ord of inv.orders) {
            let newWeeklyOrder = {
              custName: inv["custName"],
              delivDate: delivDate,
              prodName: ord["prodName"],
              qty: ord["qty"],
              rate: ord["rate"],
            };
            thisWeeksOrders.push(newWeeklyOrder);
            try {
              await API.graphql(
                graphqlOperation(createHeldforWeeklyInvoicing, {
                  input: { ...newWeeklyOrder },
                })
              );
            } catch (error) {
              console.log("error on creating Orders", error);
            }
          }
        }

        let custStart = thisWeeksOrders.map((ord) => ord["custName"]);
        custStart = new Set(custStart);
        custStart = Array.from(custStart);
        let addDeliv = custStart.map((cust) => ({
          custName: cust,
          delivDate: [],
        }));

        for (let cust of custStart) {
          for (let ord of thisWeeksOrders) {
            if (ord.custName === cust) {
              if (
                !addDeliv[
                  addDeliv.findIndex((add) => add.custName === cust)
                ].delivDate.includes(ord.delivDate)
              ) {
                addDeliv[
                  addDeliv.findIndex((add) => add.custName === cust)
                ].delivDate.push(ord.delivDate);
              }
            }
          }
          let reformatted = addDeliv[
            addDeliv.findIndex((add) => add.custName === cust)
          ].delivDate.map((dt) => ({ delivDate: dt, orders: [] }));
          addDeliv[
            addDeliv.findIndex((add) => add.custName === cust)
          ].delivDate = reformatted;
        }



        console.log(addDeliv);

        setWeeklyInvoices(addDeliv);
      }
    } catch (error) {
      console.log("error on fetching listHeldforWeeklyInvoicings List", error);
    }
  };

  const calcSumTotal = (data) => {
    let sum;
    try {
      sum = Number(data.qty) * Number(data.rate);
    } catch {
      sum = 0;
    }
    sum = formatter.format(sum);

    return <div>{sum}</div>;
  };

  const rowExpansionTemplate = (data) => {
    
    return (
      <ExpandedWeeklyRows
        data={data}
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
    <div className="datatable-rowexpansion-demo">
      <div className="card">
        <DataTable
          value={weeklyInvoices}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="custName"
          className="p-datatable-sm"
        >
          <Column expander style={{ width: "3em" }} />
         
          <Column field="custName" header="Customer" />
          

          <Column
            headerStyle={{ width: "4rem" }}
            body={(e) =>
              DeleteInvoice(e.invNum, weeklyInvoices, setWeeklyInvoices)
            }
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default WeeklyBillingGrid;
