import React, { useContext, useEffect, useState } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";

import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

import styled from "styled-components";

import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../helpers/dateTimeHelpers";

const { DateTime } = require("luxon");

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

const SelectDate = ({ database, dailyInvoices, setDailyInvoices }) => {
  const [products, customers, routes, standing, orders] = database;
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);

  const [pickedCustomer, setPickedCustomer] = useState();

  useEffect(() => {
    setDelivDate(today);
  }, []);

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-dd-MM"));
  };

  const exportCSV = async () => {
    let data = [];

    dailyInvoices = dailyInvoices.filter(
      (daily) =>
        customers[
          customers.findIndex((custo) => custo.custName === daily.custName)
        ].invoicing === "daily"
    );

    for (let inv of dailyInvoices) {
      for (let ord of inv.orders) {
        let ddate = convertDatetoBPBDate(delivDate);
        let dueDate = convertDatetoBPBDate(
          DateTime.now()
            .setZone("America/Los_Angeles")
            .plus({ days: 15 })
            .toString()
            .split("T")[0]
        );
        let custIndex = customers.findIndex(
          (cust) => cust["custName"] === inv["custName"]
        );
        let BillAddrLine1 = customers[custIndex].addr1;
        let BillAddrLine2 = customers[custIndex].addr2;
        let BillAddrCity = customers[custIndex].city;
        let PostalCode = customers[custIndex].zip;
        let ponote;
        try {
          ponote =
            orders[
              orders.findIndex(
                (order) =>
                  order.delivDate === delivDate &&
                  order.custName === ord.custName
              )
            ].PONote;
        } catch {
          ponote = "na";
        }

        let newEntry = [
          inv.invNum,
          inv.custName,
          ddate,
          dueDate,
          ddate,
          "net15",
          "Wholesale",
          BillAddrLine1,
          BillAddrLine2,
          "",
          BillAddrCity,
          "CA",
          PostalCode,
          ponote,
          true,
          ord.prodName,
          ord.prodName,
          ord.qty,
          ord.rate,
          "Y",
        ];
        console.log("newEntry", newEntry);
        data.push(newEntry);
      }
    }

    let todayDay = DateTime.now().setZone("America/Los_Angeles").weekdayLong;

    if (todayDay) {
      for (let ord of orders) {
        try {
          if (
            customers[
              customers.findIndex((custo) => custo.custName === ord.custName)
            ].invoicing === "weekly"
          ) {
            ord["invoicing"] = "weekly";
          } else {
            ord["invoicing"] = "none";
          }
        } catch {
          ord["invoicing"] = "none";
        }
      }

      let weeklyOrders = orders.filter(
        (ord) =>
          ord.invoicing === "weekly" &&
          (ord.delivDate === convertDatetoBPBDate(todayPlus()[0]) ||
            ord.delivDate === convertDatetoBPBDate(todayPlus()[4]) ||
            ord.delivDate === convertDatetoBPBDate(todayPlus()[6]) ||
            ord.delivDate === convertDatetoBPBDate(todayPlus()[7]) ||
            ord.delivDate === convertDatetoBPBDate(todayPlus()[8]) ||
            ord.delivDate === convertDatetoBPBDate(todayPlus()[9]) ||
            ord.delivDate === convertDatetoBPBDate(todayPlus()[10]))
      );
      console.log("orders", orders);
      console.log("weeklyOrders", weeklyOrders);

      for (let stand of standing) {
        try {
          if (
            customers[
              customers.findIndex((custo) => custo.custName === stand.custName)
            ].invoicing === "weekly"
          ) {
            stand["invoicing"] = "weekly";
          } else {
            stand["invoicing"] = "none";
          }
        } catch {
          stand["invoicing"] = "none";
        }
      }

      let convertedStandList = [];
      let dateArray = [
        todayPlus()[0],
        todayPlus()[4],
        todayPlus()[6],
        todayPlus()[7],
        todayPlus()[8],
        todayPlus()[9],
        todayPlus()[10],
      ];
      let builtStandList = standing.filter(
        (stand) => stand.isStand === true && stand.invoicing === "weekly"
      );
      console.log("builtStandList", builtStandList);
      for (let d of dateArray) {
        let dateSplit = d.split("-");
        let dayOfWeek = DateTime.local(
          Number(dateSplit[0]),
          Number(dateSplit[1]),
          Number(dateSplit[2])
        ).weekdayShort;
        let toAddToConvertedStandList = builtStandList.map((order) => ({
          id: null,
          version: order["_version"],
          qty: order[dayOfWeek],
          prodName: order["prodName"],
          custName: order["custName"],

          isWhole: true,
          delivDate: convertDatetoBPBDate(d),
          timeStamp: order["timeStamp"],
          SO: order[dayOfWeek],
        }));
        console.log("toAdd", toAddToConvertedStandList);
        for (let item of toAddToConvertedStandList) {
          convertedStandList.push(item);
        }
      }

      console.log("convertedStandList", convertedStandList);
      /*
      
      //  Combine orders and standing orders, orders take precedence
      //  Create weeklyInvoices
      //  Append orders to data similar to weekly but with attention to delivDate and fulfill date


      */
    }

    //  Sort data by deliveryDate and then customer

    var csv =
      "RefNumber,Customer,TxnDate,DueDate,ShpDate,SalesTerm,Class,BillAddrLine1,BillAddrLine2,BillAddrLine3,BillAddrCity,BillAddrState,BillAddrPostalCode,Msg,AllowOnlineACHPayment,LineItem,LineDescrip,LineQty,LineUnitPrice,LineTaxable\n";
    data.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = `${delivDate}invoiceExport.csv`;
    hiddenElement.click();
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
