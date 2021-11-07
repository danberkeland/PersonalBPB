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

import { listInfoQBAuths } from "../../../graphql/queries";
import { updateProduct } from "../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";


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

const SelectDate = ({ database, dailyInvoices, setDailyInvoices }) => {
  const [products, customers, routes, standing, orders] = database;
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);
  const { setIsLoading } = useContext(ToggleContext);
  
  useEffect(() => {
    setDelivDate(today);
  }, []);

  useEffect(() => {
    console.log("dailyInvoices",dailyInvoices)
  },[dailyInvoices])

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
  };

  const exportCSV = async () => {
    setIsLoading(true);
    let access;
    let val = await axios.get(
      "https://28ue1wrzng.execute-api.us-east-2.amazonaws.com/done"
    );

    if (val.data) {
      let authData = await API.graphql(
        graphqlOperation(listInfoQBAuths, { limit: "50" })
      );
      access = authData.data.listInfoQBAuths.items[0].infoContent;

      console.log(access);
    } else {
      console.log("not valid QB Auth");
    }

    

    for (let inv of dailyInvoices) {
      try {
        let total = 0;

        let custOrders = [];
        let count = 0;
        for (let ord of inv.orders) {
          count = count + 1;
          total = total + Number(ord.rate) * Number(ord.qty);
          let qbID = null;
          try {
            qbID =
              products[
                products.findIndex((pro) => pro.prodName === ord.prodName)
              ].qbID;
          } catch {}

          let item = {
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
          custOrders.push(item);
        }

        let TxnDate = delivDate;
        let DocNum = inv.invNum;
        let dueDate = todayPlus()[11]; // relate this to terms
        let custInvoicing =
          customers[
            customers.findIndex((cust) => cust.custName === inv.custName)
          ].invoicing;
        let custNick =
          customers[
            customers.findIndex((cust) => cust.custName === inv.custName)
          ].nickName;
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
                  order.delivDate === delivDate &&
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
        let ind = customers.findIndex(
          (custom) => custom.custName === inv.custName
        );

        try {
          addr1 = customers[ind].addr1;
          addr2 = customers[ind].city;
          state = "CA";
          zipCode = customers[ind].zip;
          terms = customers[ind].terms;
          custEmail = customers[ind].email;
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

        console.log(custSetup);

        let invID;
        console.log("DocNum", DocNum);
        try {
          invID = await axios.post(
            "https://unfaeakk8g.execute-api.us-east-2.amazonaws.com/done",
            {
              accessCode: "Bearer " + access,
              doc: DocNum,
            }
          );
        } catch {
          console.log("Error grabbing invID for " + DocNum);
        }
        console.log("invID", invID.data.Id);
        console.log("SyncToken", invID.data.SyncToken);

        if (Number(invID.data.Id)>0) {
          console.log("yes");
          custSetup.Id = invID.data.Id;
          custSetup.SyncToken = invID.data.SyncToken;
          custSetup.sparse = true;
          //  if customer is weekly -
          //          read full invoice
          //          if order lines from current date - remove
          //          soft update current date orders
          //      if daily - full update
          //          axios post to update inv with body.  Return 200
        } else {
          console.log("no");
          try {
            invID = await axios.post(
              "https://9u7sp5khrc.execute-api.us-east-2.amazonaws.com/done",
              {
                accessCode: "Bearer " + access,
                invInfo: custSetup,
              }
            );
          } catch {
            console.log("Error creating Invoice " + DocNum);
          }
        }
        
      } catch {}
    }
    setIsLoading(false);
  };

  const showCode = () => {
    let win = "/" + window.location.href.split("/")[4];
    confirmDialog({
      message: win,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
    });
  };

  const createQBCodes = async () => {
    // Refresh QB Auth
    let access;
    let val = await axios.get(
      "https://28ue1wrzng.execute-api.us-east-2.amazonaws.com/done"
    );

    if (val.data) {
      let authData = await API.graphql(
        graphqlOperation(listInfoQBAuths, { limit: "50" })
      );
      access = authData.data.listInfoQBAuths.items[0].infoContent;

      console.log(access);
    } else {
      console.log("not valid QB Auth");
    }

    for (let prod of products) {
      let product = prod.prodName;
      let qbID;

      try {
        qbID = await axios.post(
          "https://2ai471mlv6.execute-api.us-east-2.amazonaws.com/done",
          {
            accessCode: "Bearer " + access,
            produ: product,
          }
        );
      } catch {
        console.log("Error grabbing custNum for " + product);
      }

      let prodId =
        products[products.findIndex((prodo) => product === prodo.prodName)].id;

      let updateDetails = {
        id: prodId,
        qbID: qbID.data,
      };

      try {
        await API.graphql(
          graphqlOperation(updateProduct, { input: { ...updateDetails } })
        );
        console.log(product, "Successful update");
      } catch (error) {
        console.log(error, "Failed Update");
      }
    }
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
        {/*
        <Button className="p-button-success" onClick={exportCSV}>
          Auth QB
        </Button>*/}
        <Button className="p-button-success" onClick={exportCSV}>
          EXPORT CSV
        </Button>
        {/*}
        <Button className="p-button-success" onClick={createQBCodes}>
          Create QB Codes
        </Button>
        
        <Button className="p-button-success" onClick={exportCSV}>
          PDF
      </Button>*/}
      </BasicContainer>
    </React.Fragment>
  );
};

export default SelectDate;
