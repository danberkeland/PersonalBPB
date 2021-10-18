import React, { useContext, useEffect, useState } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";

import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

import styled from "styled-components";

import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../helpers/dateTimeHelpers";
import { compileOrderList } from "../../../helpers/CartBuildingHelpers";
import {
  sortAtoZDataByIndex,
  sortZtoADataByIndex,
} from "../../../helpers/sortDataHelpers";

const { DateTime } = require("luxon");
const axios = require('axios').default


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


    try{
      const response = await axios.get('https://9f8pe4o3wk.execute-api.us-east-2.amazonaws.com/done');
      console.log(response.data)
      window.open(response.data)
      
    }catch{
      
    }
    
    
    let data = [];

    let dailyInvoices = orders.filter(
      (ord) => ord.delivDate === convertDatetoBPBDate(delivDate)
    );

    for (let daily of dailyInvoices) {
      try {
        if (
          customers[
            customers.findIndex((custo) => custo.custName === daily.custName)
          ].invoicing !== "daily"
        ) {
          daily["invoicing"] = "none";
        } else {
          daily["invoicing"] = "daily";
        }
      } catch {
        daily["invoicing"] = "daily";
      }
    }

    dailyInvoices = dailyInvoices.filter(
      (daily) => daily.invoicing === "daily"
    );

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

      let convertedDailyStandList = [];

      let builtDailyStandList = standing.filter(
        (stand) => stand.isStand === true && stand.invoicing === "daily"
      );

      let dateSplit = todayPlus()[0].split("-");
      let dayOfWeek = DateTime.local(
        Number(dateSplit[0]),
        Number(dateSplit[1]),
        Number(dateSplit[2])
      ).weekdayShort;
      let toAddToConvertedStandList = builtDailyStandList.map((order) => ({
        id: null,
        version: order["_version"],
        qty: order[dayOfWeek],
        prodName: order["prodName"],
        custName: order["custName"],

        isWhole: true,
        delivDate: convertDatetoBPBDate(todayPlus()[0]),
        timeStamp: order["timeStamp"],
        SO: order[dayOfWeek],
      }));
      for (let item of toAddToConvertedStandList) {
        convertedDailyStandList.push(item);
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
       
        for (let item of toAddToConvertedStandList) {
          convertedStandList.push(item);
        }
      }
      let fullOrders = compileOrderList(dailyInvoices, convertedDailyStandList);
      if (todayDay === "Sunday") {
        fullOrders = compileOrderList(fullOrders, weeklyOrders);
        fullOrders = compileOrderList(fullOrders, convertedStandList);
      }

      let newDate = dateSplit[1] + dateSplit[2] + dateSplit[0];
     

      fullOrders = fullOrders.filter((ord) => ord.qty > 0);

      sortZtoADataByIndex(fullOrders, "delivDate");
      sortAtoZDataByIndex(fullOrders, "custName");
     
      for (let ord of fullOrders) {
        let ddate = convertDatetoBPBDate(delivDate);
        let dueDate = convertDatetoBPBDate(
          DateTime.now()
            .setZone("America/Los_Angeles")
            .plus({ days: 15 })
            .toString()
            .split("T")[0]
        );
        let custIndex = customers.findIndex(
          (cust) => cust["custName"] === ord["custName"]
        );

        let prodIndex = products.findIndex(
          (prod) => prod["prodName"] === ord["prodName"]
        );

        if (!ord.rate) {
          ord.rate = products[prodIndex].wholePrice;
        }
        let nick;
        nick = custIndex > -1 ? customers[custIndex].nickName : "";
        ord.invNum = newDate + nick;
        let qty = custIndex > -1 ? ord.qty : 0;
        let BillAddrLine1 = custIndex > -1 ? customers[custIndex].addr1 : "";
        let BillAddrLine2 = custIndex > -1 ? customers[custIndex].addr2 : "";
        let BillAddrCity = custIndex > -1 ? customers[custIndex].city : "";
        let PostalCode = custIndex > -1 ? customers[custIndex].zip : "";
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
          ord.invNum,
          ord.custName,
          ddate,
          dueDate,
          ord.delivDate,
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
          qty,
          ord.rate,
          "Y",
        ];
      
        data.push(newEntry);
      }

      data = data.filter((dat) => dat[17] > 0);

      /*
      
      //  Create weeklyInvoices
      //  Append orders to data similar to weekly but with attention to delivDate and fulfill date


      */
    }

    //  Sort data by deliveryDate and then customer
    /*
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
    */
  };

  const showCode = () => {
    let win = "/" + window.location.href.split('/')[1]
    confirmDialog({
      message:
        win
       ,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      
    });
  }

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
          Auth QB
        </Button>
        <Button className="p-button-success" onClick={showCode}>
          EXPORT CSV
        </Button>
        <Button className="p-button-success" onClick={exportCSV}>
          Send Invoices
        </Button>
        <Button className="p-button-success" onClick={exportCSV}>
          PDF
        </Button>
      </BasicContainer>
    </React.Fragment>
  );
};

export default SelectDate;
