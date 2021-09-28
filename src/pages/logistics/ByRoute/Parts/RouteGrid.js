import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { formatter } from "../../../../helpers/billingGridHelpers";


import {
  buildProductArray,
  createRouteGridColumns,
  createColumns,
  createListOfCustomers,
  createQtyGrid,
} from "../../../../helpers/delivGridHelpers";

import styled from "styled-components";
import { sortAtoZDataByIndex } from "../../../../helpers/sortDataHelpers";

const { DateTime } = require("luxon");

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-content: flex-end;
`;

const ButtonWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 40%;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;

  background: #ffffff;
`;

const RouteGrid = ({ route,
  orderList,
  altPricing,
  database,
  delivDate }) => {

  const dt = useRef(null);

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const constructColumns = () => {
    const [products, customers, routes, standing, orders] = database;
    let columns;
    if (orderList) {
      let buildGridSetUp = orderList.filter((ord) => ord["route"] === route);
      let listOfProducts = buildProductArray(buildGridSetUp, products);

      columns = createRouteGridColumns(listOfProducts);
    }
  
    return columns;
  };

  const constructData = () => {
    let qtyGrid;
    if (orderList) {
     
      let buildGridSetUp = orderList.filter((ord) => ord["route"] === route);

      let gridToEdit = buildGridSetUp.filter(
        (order) => order["route"] === route
      );
      let listOfCustomers = createListOfCustomers(gridToEdit, route);
      
      qtyGrid = createQtyGrid(listOfCustomers, gridToEdit);
     
    }
    
    return qtyGrid;
  };

  useEffect(() => {
    let col = constructColumns();
    let dat = constructData();
   
    //sortAtoZDataByIndex(dat,"delivOrder")
    
    setColumns(col ? col : []);
    setData(dat ? dat : []);
  }, [route, orderList ]);

  const dynamicColumns = columns.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  const exportColumns = columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));
  
  const exportListPdf = () => {
    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(20);
    doc.text(10, 20, "Delivery Sheet");
    doc.autoTable({
      columns: exportColumns,
      body: data,
      margin: { top: 26 },
      styles: { fontSize: 12 },
    });
    doc.save("products.pdf");
  };

  const ratePull = (ord) => {
    const [products, customers, routes, standing, orders] = database;
    let ratePull =
        products[
          products.findIndex((prod) => prod["prodName"] === ord["prodName"])
        ].wholePrice;
      for (let alt of altPricing) {
        if (
          alt["custName"] === ord["custName"] &&
          alt["prodName"] === ord["prodName"]
        ) {
          ratePull = alt["wholePrice"];
        }
      }
      return ratePull
  }
  

  const exportInvPdf = () => {
    const [products, customers, routes, standing, orders] = database;
    let invListFilt = orderList.filter((ord) => ord.route === route);
    let custFil = invListFilt.map((inv) => inv.custName);
    custFil = new Set(custFil);
    custFil = Array.from(custFil);
    let customersCompare = customers.map((cust) => cust.custName);
    let ordersToInv = orderList.filter(
      (ord) =>
        custFil.includes(ord.custName) &&
        customersCompare.includes(ord.custName)
    );
    ordersToInv = ordersToInv.filter(
      (ord) =>
        customers[customers.findIndex((cust) => cust.custName === ord.custName)]
          .toBePrinted === true
    );
    let ThinnedCustFil = ordersToInv.map((ord) => ord.custName);
    ThinnedCustFil = new Set(ThinnedCustFil);
    ThinnedCustFil = Array.from(ThinnedCustFil);

    const doc = new jsPDF("0", "mm", "a4");

    let init = true;
    for (let inv of ThinnedCustFil) {
      let leftMargin = 22;
      let rightColumn = 130;

      let custInd = customers.findIndex((cust) => cust.custName === inv);

      let addr1 = customers[custInd].addr1;
      let addr2 = customers[custInd].addr2;
      let phone = customers[custInd].phone;

      let dateSplit = delivDate.split("-");
      let newDate = dateSplit[1] + dateSplit[2] + dateSplit[0];
      let invNum =
        newDate +
        customers[customers.findIndex((cst) => cst.custName === inv)].nickName;
      let ponote;
      try {
        ponote =
          orders[
            orders.findIndex(
              (ord) => ord.custName === customers[custInd].custName
            )
          ].ponote;
        if (ponote === undefined) {
          ponote = "";
        }
      } catch {
        ponote = "";
      }

      let delivdate = DateTime.now().toLocaleString(DateTime.DATE_FULL);
      let duedate = DateTime.now()
        .plus({ days: 15 })
        .toLocaleString(DateTime.DATE_FULL);

      let head = [["Item", "Price", "Qty", "Total", "Returns"]];
      let body = orderList.filter((ord) => ord.custName === inv);
      body = body.map((ord) => [
        ord.prodName,
        formatter.format(Number(ratePull(ord))),
        ord.qty,
        (Number(ratePull(ord)) * Number(ord.qty)).toFixed(2),
      ]);

      let ordTotal = 0
      for (let b of body){
        ordTotal = ordTotal + Number(b[3])
      }


      let blank = ['','','','']
      let total = ["TOTAL",'','',formatter.format(ordTotal)]


      body.push(blank)
      body.push(total)

      let dup
      customers[custInd].printDuplicate===true ? dup = 2 : dup = 1

      for (let i=0; i<dup; i++){
      !init && doc.addPage("0", "mm", "a4");

      doc.setFontSize(26);
      doc.text(leftMargin, 26, "Back Porch Bakery");
      doc.setFontSize(14);
      doc.text(
        leftMargin,
        32,
        "849 West St., San Luis Obispo, CA 93405 (805)242-4403"
      );
      doc.setFontSize(14);
      doc.text(rightColumn, 46, `Customer:`);
      doc.setFontSize(12);
      doc.text(rightColumn, 56, `${inv}`);
      doc.text(rightColumn, 62, `${addr1}`);
      doc.text(rightColumn, 68, `${addr2}`);
      doc.text(rightColumn, 74, `${phone}`);

      doc.autoTable({
        body: [
          ["Invoice #:", `${invNum}`],
          ["PO #:", `${ponote}`],
          ["Delivery Date:", `${delivdate}`],
          ["Due Date:", `${duedate}`],
        ],
        margin: { top: 80, left: leftMargin, right: leftMargin },
        styles: { fontSize: 12 },
      });

      doc.autoTable({
        head: head,
        body: body,
        margin: { top: 110, left: leftMargin, right: leftMargin },
        styles: { fontSize: 12 },
      });

      init = false;
    }
  }
    doc.save("invoices.pdf");
  };

  const exportFullPdf = () => {
    const [products, customers, routes, standing, orders] = database;
    let init = true;
    let routeList = Array.from(new Set(orderList.map((ord) => ord.route)));
    const doc = new jsPDF("l", "mm", "a4");
    for (let rt of routeList) {
      let columns;
      if (orderList) {
        let buildGridSetUp = orderList.filter((ord) => ord["route"] === rt);

        let gridToEdit = buildGridSetUp.filter((grd) => grd["route"] === rt);
        let listOfProducts = buildProductArray(gridToEdit, products);

        columns = createRouteGridColumns(listOfProducts);
      }
      columns = columns.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      let qtyGrid;
     
      if (orderList) {
        let buildGridSetUp = orderList.filter((ord) => ord["route"] === rt);
        
        
        let listOfCustomers = createListOfCustomers(buildGridSetUp, rt);
        qtyGrid = createQtyGrid(listOfCustomers, buildGridSetUp);
        
      }

      !init && doc.addPage("a4",'l');
      doc.setFontSize(20);
      doc.text(10, 20, rt);
      doc.autoTable({
        columns: columns,
        body: qtyGrid,
        margin: { top: 26 },
        styles: { fontSize: 12 },
      });
  
      let invListFilt = orderList.filter((ord) => ord.route === rt);
    let custFil = invListFilt.map((inv) => inv.custName);
    custFil = new Set(custFil);
    custFil = Array.from(custFil);
    let customersCompare = customers.map((cust) => cust.custName);
    let ordersToInv = orderList.filter(
      (ord) =>
        custFil.includes(ord.custName) &&
        customersCompare.includes(ord.custName)
    );
    ordersToInv = ordersToInv.filter(
      (ord) =>
        customers[customers.findIndex((cust) => cust.custName === ord.custName)]
          .toBePrinted === true
    );
    let ThinnedCustFil = ordersToInv.map((ord) => ord.custName);
    ThinnedCustFil = new Set(ThinnedCustFil);
    ThinnedCustFil = Array.from(ThinnedCustFil);

    

    
    for (let inv of ThinnedCustFil) {
      let leftMargin = 22;
      let rightColumn = 130;

      let custInd = customers.findIndex((cust) => cust.custName === inv);

      let addr1 = customers[custInd].addr1;
      let addr2 = customers[custInd].addr2;
      let phone = customers[custInd].phone;

      let dateSplit = delivDate.split("-");
      let newDate = dateSplit[1] + dateSplit[2] + dateSplit[0];
      let invNum =
        newDate +
        customers[customers.findIndex((cst) => cst.custName === inv)].nickName;
      let ponote;
      try {
        ponote =
          orders[
            orders.findIndex(
              (ord) => ord.custName === customers[custInd].custName
            )
          ].ponote;
        if (ponote === undefined) {
          ponote = "";
        }
      } catch {
        ponote = "";
      }

      let delivdate = DateTime.now().toLocaleString(DateTime.DATE_FULL);
      let duedate = DateTime.now()
        .plus({ days: 15 })
        .toLocaleString(DateTime.DATE_FULL);

      let head = [["Item", "Price", "Qty", "Total", "Returns"]];
      let body = orderList.filter((ord) => ord.custName === inv);
      body = body.map((ord) => [
        ord.prodName,
        formatter.format(Number(ratePull(ord))),
        ord.qty,
        (Number(ratePull(ord)) * Number(ord.qty)).toFixed(2),
      ]);

      let ordTotal = 0
      for (let b of body){
        ordTotal = ordTotal + Number(b[3])
      }


      let blank = ['','','','']
      let total = ["TOTAL",'','',formatter.format(ordTotal)]


      body.push(blank)
      body.push(total)

      let dup
      customers[custInd].printDuplicate===true ? dup = 2 : dup = 1

      for (let i=0; i<dup; i++){
      doc.addPage('a4','portrait');

      doc.setFontSize(26);
      doc.text(leftMargin, 26, "Back Porch Bakery");
      doc.setFontSize(14);
      doc.text(
        leftMargin,
        32,
        "849 West St., San Luis Obispo, CA 93405 (805)242-4403"
      );
      doc.setFontSize(14);
      doc.text(rightColumn, 46, `Customer:`);
      doc.setFontSize(12);
      doc.text(rightColumn, 56, `${inv}`);
      doc.text(rightColumn, 62, `${addr1}`);
      doc.text(rightColumn, 68, `${addr2}`);
      doc.text(rightColumn, 74, `${phone}`);

      doc.autoTable({
        body: [
          ["Invoice #:", `${invNum}`],
          ["PO #:", `${ponote}`],
          ["Delivery Date:", `${delivdate}`],
          ["Due Date:", `${duedate}`],
        ],
        margin: { top: 80, left: leftMargin, right: leftMargin },
        styles: { fontSize: 12 },
      });

      doc.autoTable({
        head: head,
        body: body,
        margin: { top: 110, left: leftMargin, right: leftMargin },
        styles: { fontSize: 12 },
      });

    }}
      
    init = false
    }
    doc.save("invoices.pdf");
    
  };
  
  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportListPdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Delivery List
        </Button>
        <Button
          type="button"
          onClick={exportInvPdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Invoices
        </Button>
        <Button
          type="button"
          onClick={exportFullPdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Full Delivery Lists
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );
    
  const onRowReorder = (e) => {
    setData(e.value);
  };

  return (
    <div>
      <div className="card">
        <DataTable
          header={header}
          ref={dt}
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={data}
          resizableColumns
          columnResizeMode="fit"
          onRowReorder={onRowReorder}
        >
          <Column rowReorder style={{ width: "3em" }} />
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
};

export default RouteGrid;
