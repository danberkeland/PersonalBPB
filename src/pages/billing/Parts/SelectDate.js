import React, { useContext, useEffect, useRef } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { confirmDialog } from 'primereact/confirmdialog'

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
  emailQBInvoice,
} from "../../../helpers/QBHelpers";

const { DateTime } = require("luxon");

const BasicContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;

  box-sizing: border-box;
`;

let today = todayPlus()[0];
let Sunday = daysOfTheWeek()[0];
let Sunday15due = daysOfTheWeek()[7];

const SelectDate = ({ database, dailyInvoices }) => {
  const [products, customers, routes, standing, orders] = database;
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);
  const { setIsLoading } = useContext(ToggleContext);

  const toast = useRef(null);

  const showSuccess = (invNum) => {
    toast.current.show({
      severity: "success",
      summary: "Invoice created",
      detail: invNum + " successfully entered",
      life: 3000,
    });
  };

  const showSuccessEmail = (custo, status) => {
    toast.current.show({
      severity: status === 200 ? "success" : "error",
      summary: "Invoice Emailed",
      detail: "Invoice Status for " + custo,
      life: 3000,
    });
  };

  const showNoEmail = (custo) => {
    toast.current.show({
      severity: "warn",
      summary: "No Invoice",
      detail: "No Invoice for " + custo,
      life: 3000,
    });
  };

  const showDoNotMail = (custo) => {
    toast.current.show({
      severity: "info",
      summary: "No Mail",
      detail: "No Mailing Option for " + custo,
      life: 3000,
    });
  };

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

  const createQBItem = (count, ord, qbID) => {
    let lineID = qbID ? delivDate.replace(/-/g, "") + qbID : "0000991234";
    lineID = lineID.slice(5);
    console.log("Id", lineID);
    return {
      Id: lineID,

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
  };

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
          let thisProd =
            products[
              products.findIndex((pro) => pro.prodName === ord.prodName)
            ];
          let qbID = null;
          try {
            qbID = thisProd.qbID;
          } catch {}

          let item = createQBItem(count, ord, qbID);
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
        /*
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
        */
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
          sparse: true,
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
          //TotalAmt: total,

          BillEmail: {
            Address: custEmail,
          },
        };
        if (custInvoicing !== "no invoice") {
          let invID;

          invID = await getQBInvIDandSyncToken(access, DocNum);
          console.log("invID", invID);
          if (Number(invID.data.Id) > 0) {
            console.log("yes");
            custSetup.Id = invID.data.Id;
            custSetup.SyncToken = invID.data.SyncToken;

            if (custInvoicing === "daily") {
              custSetup.sparse = false;
            }
          } else {
            console.log("no");
          }
          console.log("custSetup", custSetup);
          createQBInvoice(access, custSetup);
          showSuccess(DocNum);
        }
      } catch {}
    }
    setIsLoading(false);
  };

  const emailInvoices = async () => {
    setIsLoading(true);
    let access = await checkQBValidation();
    for (let inv of dailyInvoices) {
      let DocNum = inv.invNum;
      let invID = await getQBInvIDandSyncToken(access, DocNum);
      console.log(DocNum,invID.data.Id)
      if (Number(invID.data.Id) > 0) {
        invID = invID.data.Id;
        let custo =
          customers[
            customers.findIndex((cust) => cust.custName === inv.custName)
          ];
        if (custo.toBeEmailed) {
          let didItEmail = await emailQBInvoice(access, invID);
          showSuccessEmail(inv.custName, didItEmail.status);
          console.log(didItEmail.status);
        } else {
          console.log("No Invoice to email for " + inv.custName);
          showDoNotMail(inv.custName)}
      } else {
        console.log("No Invoice to email for " + inv.custName);
        showNoEmail(inv.custName);
      }
    }
    setIsLoading(false);
  };

  const confirm = (e) => {
    confirmDialog({
        message: 'Are all invoices accurate and ready for publishing?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => emailInvoices(),
       
    });
}

  return (
    <React.Fragment>
      <Toast ref={toast} />
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
        <Button className="p-button-success" onClick={(e) => {
        confirm();
      }}>
          Email Invoices
        </Button>
      </BasicContainer>
    </React.Fragment>
  );
};

export default SelectDate;
