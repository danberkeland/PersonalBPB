import React, { useContext, useEffect, useState } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

import styled from "styled-components";

import {
  convertDatetoBPBDate,
  todayPlus,
  daysOfTheWeek,
} from "../../../helpers/dateTimeHelpers";

import {
  checkQBValidation,
  createQBInvoice,
  getQBInvIDandSyncToken,
} from "../../../helpers/QBHelpers";

const { DateTime } = require("luxon");
const axios = require("axios").default;

const BasicContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;

  box-sizing: border-box;
`;

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];
let yesterday = todayPlus()[4];
let weekAgo = todayPlus()[5];
let Sunday = daysOfTheWeek()[0];
let Sunday15due = daysOfTheWeek()[7];


const SelectDate = ({ database, dailyInvoices }) => {
  const [products, customers, routes, standing, orders] = database;
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);
  const { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    setDelivDate(today);
  }, []);

  useEffect(() => {
    console.log("dailyInvoices", dailyInvoices);
  }, [dailyInvoices]);

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
  };

  const createQBItem = (count,ord,qbID) => {
    return {
      Id: count.toString() + delivDate.replace(/-/g, ""),

      Description: ord.prodName,
      Amount: Number(ord.rate) * Number(ord.qty),
      DetailType: "SalesItemLineDetail",
      SalesItemLineDetail: {
        ServiceDate: delivDate,

        UnitPrice: ord.rate,
        Qty: ord.qty,
        ItemRef: {
          name: ord.prodName,
          value: qbID,
        },
        ItemAccountRef: {
          name: "Uncategorized Income",
        },
        TaxCodeRef: {
          value: "TAX",
        },
      },
    };
  }

  const exportCSV = async () => {
    setIsLoading(true);
    let access = await checkQBValidation();

    for (let inv of dailyInvoices) {
      try {
        let count = 0;
        let total = 0;
        let custOrders = [];
        
        for (let ord of inv.orders) {
          count = count + 1;
          total = total + Number(ord.rate) * Number(ord.qty);
          let thisProd = products[
            products.findIndex((pro) => pro.prodName === ord.prodName)
          ]
          let qbID = null;
          try {
            qbID =
              thisProd.qbID;
          } catch {}

          let item = createQBItem(count,ord,qbID)
          custOrders.push(item);
        }

        let TxnDate = delivDate;
        let DocNum = inv.invNum;
        let dueDate = todayPlus()[11]; // relate this to terms
        let custo =
          customers[
            customers.findIndex((cust) => cust.custName === inv.custName)
          ];
        let custInvoicing = custo.invoicing;
        let custNick = custo.nickName;
        if (custInvoicing === "weekly") {
          TxnDate = Sunday;
          DocNum =
            TxnDate.split("-")[1] +
            TxnDate.split("-")[2] +
            TxnDate.split("-")[0] +
            custNick;
          dueDate = Sunday15due;
          console.log("TaxDate", TxnDate);
          console.log("DocNum", DocNum);
          console.log("dueDate", dueDate);
        }

        let ponote;
        try {
          ponote =
            orders[
              orders.findIndex(
                (order) =>
                  order.delivDate === convertDatetoBPBDate(delivDate) &&
                  order.custName === inv.custName
              )
            ].PONote;
        } catch {
          ponote = "na";
        }
        let addr1;
        let addr2;
        let state;
        let zipCode;
        let terms;
        let custEmail;

        try {
          addr1 = custo.addr1;
          addr2 = custo.city;
          state = "CA";
          zipCode = custo.zip;
          terms = custo.terms;
          custEmail = custo.email;
        } catch {}

        let custSetup = {
          AllowIPNPayment: false,
          AllowOnlinePayment: false,
          AllowOnlineCreditCardPayment: false,
          AllowOnlineACHPayment: true,
          domain: "QBO",
          DocNumber: DocNum,
          TxnDate: TxnDate,
          CurrencyRef: {
            value: "USD",
            name: "United States Dollar",
          },
          Line: custOrders,
          CustomerRef: {
            value: inv.qbID,
            name: inv.custName,
          },
          CustomerMemo: {
            value: ponote,
          },
          BillAddr: {
            Line1: addr1,
            CountrySubDivisionCode: state,
            PostalCode: zipCode,
          },
          ShipAddr: {
            Line1: addr1,
            Line2: addr2,
          },
          FreeFormAddress: true,

          ClassRef: {
            value: "3600000000001292604",
            name: "Wholesale",
          },
          SalesTermRef: {
            name: terms,
          },
          DueDate: dueDate,
          ShipDate: TxnDate,
          TotalAmt: total,

          BillEmail: {
            Address: custEmail,
          },
        };

        let invID;

        invID = await getQBInvIDandSyncToken(access, DocNum);

        if (Number(invID.data.Id) > 0) {
          console.log("yes");
          custSetup.Id = invID.data.Id;
          custSetup.SyncToken = invID.data.SyncToken;
          custSetup.sparse = true;
          createQBInvoice(access, custSetup);
          //  if customer is weekly -
          //          read full invoice
          //          if order lines from current date - remove
          //          soft update current date orders
          //      if daily - full update
          //          axios post to update inv with body.  Return 200
        } else {
          console.log("no");
          createQBInvoice(access, custSetup);
        }
      } catch {}
    }
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <BasicContainer>
        <div className="p-field p-col-12 p-md-4">
          <label htmlFor="delivDate">Pick Delivery Date: </label>
          <Calendar
            id="delivDate"
            placeholder={convertDatetoBPBDate(delivDate)}
            dateFormat="mm/dd/yy"
            onChange={(e) => setDate(e.value)}
          />
        </div>

        <Button className="p-button-success" onClick={exportCSV}>
          EXPORT CSV
        </Button>
      </BasicContainer>
    </React.Fragment>
  );
};

export default SelectDate;
