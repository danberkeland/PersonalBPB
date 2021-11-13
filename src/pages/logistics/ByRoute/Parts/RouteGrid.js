import React, { useEffect, useState, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';

import jsPDF from "jspdf";
import "jspdf-autotable";


import {
  buildProductArray,
  createRouteGridColumns,
  createListOfCustomers,
  createQtyGrid,
} from "../../../../helpers/delivGridHelpers";

import { fetchZones } from "../../../../helpers/databaseFetchers";

import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import styled from "styled-components";
import { checkQBValidation, grabQBInvoicePDF } from "../../../../helpers/QBHelpers";
import { downloadPDF } from "../../../../helpers/PDFHelpers";
import { sortAtoZDataByIndex } from "../../../../helpers/sortDataHelpers";

const axios = require("axios").default;

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

const RouteGrid = ({ route, orderList, altPricing, database, delivDate }) => {
  const dt = useRef(null);

  let { reload, setIsLoading } = useContext(ToggleContext);

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [zones, setZones] = useState([]);

  const toast = useRef(null);

  const showSuccess = (invNum) => {
    toast.current.show({severity:'success', summary: 'Invoice created', detail:invNum+' PDF created', life: 3000});
}

  
  useEffect(() => {
    setIsLoading(true);
    fetchZones().then((getZones) => setZones(getZones));
  }, []);
  

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

    setColumns(col ? col : []);
    setData(dat ? dat : []);
  }, [route, orderList]);

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
   
    let fileName = route.replace(' ','')+delivDate.replaceAll('-','')+".pdf"

    const doc = new jsPDF("l", "mm", "a4");
    console.log("doc",doc)
    doc.setFontSize(20);
    doc.text(10, 20, "Delivery Sheet");
    doc.autoTable({
      theme: 'grid',
      columns: exportColumns,
      body: data,
      margin: { top: 26 },
      styles: { fontSize: 12 },
    });
    doc.save(fileName);
  };


  
  const exportInvPdf = async () => {
    const [products, customers, routes, standing, orders] = database;
    let fileName = delivDate.replaceAll('-','')+"AllInvoices.pdf"
    let alreadyPrinted = []
    setIsLoading(true);
    let access = await checkQBValidation()
    

    let init = true;
    let routeList = Array.from(new Set(orderList.map((ord) => ord.route)));
    routeList = routeList.map((rt) => ({ route: rt }));
      for (let rt of routeList){
        let printOrder = routes[routes.findIndex(rou => rou.routeName === rt.route)].printOrder
        rt.printOrder = printOrder
      }
      sortAtoZDataByIndex(routeList,"printOrder")
      let routeArray = []
      for (let rt of routeList){
        routeArray.push(rt.route)
      }

    //
    //routeList = routeList.filter((rt) => rt === "AM North");
    //
    let pdfs =[]
    for (let rt of routeArray) {
      console.log("rt",rt)
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
          customers[
            customers.findIndex((cust) => cust.custName === ord.custName)
          ].toBePrinted === true
      );
      let ThinnedCustFil = ordersToInv.map((ord) => ord.custName);
      ThinnedCustFil = new Set(ThinnedCustFil);
      ThinnedCustFil = Array.from(ThinnedCustFil);

      //
      //ThinnedCustFil = ThinnedCustFil.filter((rt) => rt === "Kitchenette");
      //

      for (let thin of ThinnedCustFil) {
        console.log("cust", thin);
        let custo =
          customers[customers.findIndex((cust) => cust.custName === thin)];
        let invCt = custo.printDuplicate ? 2 : 1;
        if (!alreadyPrinted.includes(thin))
        for (let i = 0; i < invCt; i++) {
          let invPDF;
          try {
            let custQBID = custo.qbID;
            let txnDate = delivDate;
            await grabQBInvoicePDF(access, invPDF, txnDate, custQBID, pdfs);
            showSuccess(thin);
          } catch {}
        } alreadyPrinted.push(thin)
        
      }
    }
    downloadPDF(pdfs, fileName)
    setIsLoading(false);
  };

  

  const exportFullPdf = () => {
    const [products, customers, routes, standing, orders] = database;
    let fileName = delivDate.replaceAll('-','')+"AllRoutes.pdf"
    let init = true;
    let routeList = Array.from(new Set(orderList.map((ord) => ord.route)));
    routeList = routeList.map((rt) => ({ route: rt }));
      for (let rt of routeList){
        let printOrder = routes[routes.findIndex(rou => rou.routeName === rt.route)].printOrder
        rt.printOrder = printOrder
      }
      sortAtoZDataByIndex(routeList,"printOrder")
      let routeArray = []
      for (let rt of routeList){
        routeArray.push(rt.route)
      }
    const doc = new jsPDF("l", "mm", "a4");
    for (let rt of routeArray) {
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
        theme: 'grid',
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

    

    init = false
    }
    doc.save(fileName);
    
  };
  

  const header = (
    <ButtonContainer>
      <Toast ref={toast} />
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
          Print All Routes
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
