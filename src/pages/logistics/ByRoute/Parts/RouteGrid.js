import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { PDFDocument } from "pdf-lib";

import { listZones } from "../../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import {
  buildProductArray,
  createRouteGridColumns,
  createColumns,
  createListOfCustomers,
  createQtyGrid,
} from "../../../../helpers/delivGridHelpers";

import styled from "styled-components";
import { listInfoQBAuths } from "../../../../graphql/queries";
import fs from "fs";
import { checkQBValidation } from "../../../../helpers/QBHelpers";

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

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [zones, setZones] = useState([]);

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

  const fetchZones = async () => {
    try {
      let zones = await fetchInfo(listZones, "listZones", "50");
      setZones(zones);
    } catch (error) {
      console.log("error on fetching Zone List", error);
    }
  };

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
    fetchZones();
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
    return ratePull;
  };

  const downloadPDF = async (pdfs) => {
    
    const mergedPdf = await PDFDocument.create();

    for (let pdf of pdfs){
      try{
        let pdfA = await PDFDocument.load(pdf);
      const copiedPagesA = await mergedPdf.copyPages(
        pdfA,
        pdfA.getPageIndices()
      );
      copiedPagesA.forEach((page) => mergedPdf.addPage(page));
      } catch {}
     
    }


    const mergedPdfFile = await mergedPdf.saveAsBase64({ dataUri: true});
           



    let pdf = mergedPdfFile.split("base64,")[1];
    
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "abc.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    
  };

  const exportInvPdf = async () => {
    const [products, customers, routes, standing, orders] = database;

    let access = await checkQBValidation()
    

    let init = true;
    let routeList = Array.from(new Set(orderList.map((ord) => ord.route)));

    //
    //routeList = routeList.filter((rt) => rt === "AM North");
    //
    let pdfs =[]
    for (let rt of routeList) {
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
        console.log("cust",thin)
        let invPDF;
        try {
          let custQBID =
            customers[customers.findIndex((cust) => cust.custName === thin)]
              .qbID;
          let txnDate = delivDate;
          try {
            invPDF = await axios.post(
              "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done",
              {
                accessCode: "Bearer " + access,
                delivDate: txnDate,
                custID: custQBID,
              }
            );
            console.log(invPDF.data)
            pdfs.push(invPDF.data)
            
          } catch {}
        } catch {}
      }
    }
    downloadPDF(pdfs)
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
