import React, { useContext, useEffect, useState } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { CustomerContext } from "../../../dataContexts/CustomerContext";

import { Calendar } from "primereact/calendar";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import styled from "styled-components";

import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../helpers/dateTimeHelpers";

import { fetchInfo } from "../../../helpers/billingGridHelpers";

import { listHeldforWeeklyInvoicings } from "../../../graphql/queries";

import { OrdersContext } from "../../../dataContexts/OrdersContext";

const clonedeep = require("lodash.clonedeep");

const { DateTime } = require("luxon");

const BasicContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;

  box-sizing: border-box;
`;

const SelectDate = ({
  dailyInvoices,
  setDailyInvoices,
}) => {
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);
  const { customers } = useContext(CustomerContext);
  const { orders } = useContext(OrdersContext);

  const [pickedCustomer, setPickedCustomer] = useState();

  useEffect(() => {
    let [today] = todayPlus();
    setDelivDate(today);
  }, []);

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
  };

  const handleAddCustomer = (e) => {
    let invToModify = clonedeep(dailyInvoices);
    let dateSplit = delivDate.split("-");
    let newDate = dateSplit[1] + dateSplit[2] + dateSplit[0];
    invToModify.push({
      custName: e.target.value,
      invNum: newDate+customers[customers.findIndex(cst => cst.custName===e.target.value)].nickName,
      orders: [],
    });
    setDailyInvoices(invToModify);
    setPickedCustomer("");
  };

  const exportCSV = async () => {
    
  
    let data = [];
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
        data.push(newEntry);
      }
    }

    let todayDay = DateTime.now().setZone("America/Los_Angeles").weekdayLong;

    if (todayDay === "Thursday") {
      let weeklyInfo = await fetchInfo(
        listHeldforWeeklyInvoicings,
        "listHeldforWeeklyInvoicings",
        "1000"
      );

      let custSet = weeklyInfo.map((week) => week.custName);
      custSet = new Set(custSet);
      let custArray = Array.from(custSet);
      let dateSplit = delivDate.split("-");
      let newDate = dateSplit[1] + dateSplit[2] + dateSplit[0];
      custArray = custArray.map((cust) => ({
        custName: cust,
        invNum: newDate+customers[customers.findIndex(cst => cst.custName===cust)].nickName,
      }));
      let weeklyOrders = [];
      for (let cust of custArray) {
        let newOrders = [];
        for (let inv of weeklyInfo) {
          if (inv.custName === cust.custName) {
            let newOrder = {
              prodName: inv.prodName,
              qty: inv.qty,
              rate: inv.rate,
              fullDate: inv.delivDate,
            };
            newOrders.push(newOrder);
          }
        }

        let newCust = {
          custName: cust.custName,
          invNum: cust.invNum,
          orders: newOrders,
        };
        weeklyOrders.push(newCust);
      }
      for (let inv of weeklyOrders) {
        for (let ord of inv.orders) {
        
          let ddate = convertDatetoBPBDate(delivDate);
          let fullDate=convertDatetoBPBDate(ord.fullDate)
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
            fullDate,
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
        
          data.push(newEntry);
          console.log(data)
        }
      }
    }

    

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
            disabled
            dateFormat="mm/dd/yy"
            onChange={(e) => setDate(e.value)}
          />
        </div>
        <div>
          <Button value={pickedCustomer} onClick={(e) => handleAddCustomer(e)}>
            ADD CUSTOMER +
          </Button>

          <Dropdown
            optionLabel="custName"
            options={customers}
            placeholder={pickedCustomer}
            name="customers"
            value={pickedCustomer}
            onChange={(e) => setPickedCustomer(e.target.value.custName)}
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
