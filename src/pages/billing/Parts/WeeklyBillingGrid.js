import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { CustomerContext } from "../../../dataContexts/CustomerContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
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
  fetchInfo,
} from "../../../helpers/billingGridHelpers";

import { ExpandedWeeklyRows } from "./Parts/ExpandedWeeklyRows";
import { DeleteInvoice } from "./Parts/DeleteInvoice";

import { API, graphqlOperation } from "aws-amplify";

import { listHeldforWeeklyInvoicings } from "../../../graphql/queries";
import { createHeldforWeeklyInvoicing } from "../../../graphql/mutations";

const WeeklyBillingGrid = ({
  altPricing,
  nextInv,
  weeklyInvoices,
  setWeeklyInvoices,
  zones,
}) => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [ weeklyLoaded, setWeeklyLoaded ] = useState(false)

  const [pickedProduct, setPickedProduct] = useState();
  const [pickedRate, setPickedRate] = useState();
  const [pickedQty, setPickedQty] = useState();

  const { delivDate } = useContext(CurrentDataContext);
  const { products } = useContext(ProductsContext);
  const { customers } = useContext(CustomerContext);
  const { orders } = useContext(OrdersContext);
  const { standing } = useContext(StandingContext);
  const { readyForWeekly, setReadyForWeekly, setIsLoading } = useContext(
    ToggleContext
  );

  useEffect(()=> {
    if(!weeklyLoaded){
    addOrdersToDB(weeklyInvoices)
  }
  },[weeklyInvoices])

  useEffect(() => {
    try{
      if (
        orders.length>0 &&
        standing.length>0 &&
        customers.length>0 &&
        products.length>0){
          setReadyForWeekly(true)
        }


    } catch {
      console.log("Not ready for weeklies")
    }
  })

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
        "weekly"
      );
      setWeeklyInvoices(invOrders);
      
      setIsLoading(true);
    } catch {
      console.log("Trouble building invOrders");
    }
  }, [readyForWeekly]);

  

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
    setIsLoading(true)
    
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

        // Filter delivDate back to last Monday

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

        for (let ord of thisWeeksOrders) {
          let ordToAdd = {
            prodName: ord.prodName,
            qty: ord.qty,
            rate: ord.rate,
          };
          let custInd = addDeliv.findIndex(
            (add) => add.custName === ord.custName
          );
          let delivInd = addDeliv[custInd].delivDate.findIndex(
            (deliv) => deliv.delivDate === ord.delivDate
          );
          let check = addDeliv[custInd].delivDate[delivInd].orders.map(
            (item) => item.prodName
          );
          if (!check.includes(ord.prodName)) {
            addDeliv[custInd].delivDate[delivInd].orders.push(ordToAdd);
          }
        }

        setIsLoading(false);
        setWeeklyInvoices(addDeliv);
        setWeeklyLoaded(true)
      }
    } catch (error) {
      console.log("error on fetching listHeldforWeeklyInvoicings List", error);
    }
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
