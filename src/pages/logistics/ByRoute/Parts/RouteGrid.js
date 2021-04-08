import React, { useContext, useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';

import jsPDF from 'jspdf'
import 'jspdf-autotable'

import { ProductsContext } from "../../../../dataContexts/ProductsContext";
import { OrdersContext } from "../../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../../dataContexts/StandingContext";
import { CustomerContext } from "../../../../dataContexts/CustomerContext";


import {
  buildProductArray,
  createColumns,
  createListOfCustomers,
  createQtyGrid,
} from "../../../../helpers/delivGridHelpers";

import styled from "styled-components";



const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-content: flex-end;
  `

const ButtonWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 40%;
  flex-direction: row;
  justify-content:space-between;
  align-content: center;

  background: #ffffff;
`;


const RouteGrid = ({ route, orderList }) => {
  const { products } = useContext(ProductsContext);
  const { orders } = useContext(OrdersContext);
  const { standing } = useContext(StandingContext);
  const { customers } = useContext(CustomerContext)

  const dt = useRef(null);

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const constructColumns = () => {
    let columns;
    if (orderList) {
      let buildGridSetUp = orderList.filter((ord) => ord["route"] === route);

      let gridToEdit = buildGridSetUp.filter((grd) => grd["route"] === route);
      let listOfProducts = buildProductArray(gridToEdit, products);

      columns = createColumns(listOfProducts);
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
  }, [route, orderList, orders, standing]);

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

  const exportColumns = columns.map(col => ({ title: col.header, dataKey: col.field }));

  const exportListPdf = () => {
    const doc = new jsPDF('l','mm','a4');
    doc.setFontSize(24);
    doc.text(10,20,'Delivery Sheet');
    doc.autoTable({
      columns: exportColumns, 
      body: data,
      margin: { top:26 },
      styles: {fontSize: 16}
    }
    );
    doc.save("products.pdf");
  };

  const exportInvPdf = () => {
    let invListFilt = orderList.filter(ord => ord.route===route)
    let custFil = invListFilt.map(inv => inv.custName)
    custFil = new Set(custFil)
    custFil = Array.from(custFil)
    let customersCompare = customers.map(cust => cust.custName)
    let ordersToInv = orderList.filter(ord => custFil.includes(ord.custName) && customersCompare.includes(ord.custName))
    ordersToInv = ordersToInv.filter(ord => customers[customers.findIndex(cust => cust.custName===ord.custName)].toBePrinted===true)
    let ThinnedCustFil = ordersToInv.map(ord => ord.custName)
    ThinnedCustFil = new Set(ThinnedCustFil)
    ThinnedCustFil = Array.from(ThinnedCustFil)
    



    const doc = new jsPDF('0','mm','a4');

    let init = true
    for (let inv of ThinnedCustFil){

      let leftMargin = 25
      let rightColumn = 130

      let custInd = customers.findIndex(cust => cust.custName === inv)

      let addr1 = customers[custInd].addr1
      let addr2 = customers[custInd].addr2
      let phone = customers[custInd].phone

      let invNum = "9999"
      let ponote = "123456"
      let delivdate = "Thursday, April 8, 2021"
      let duedate = "Friday, April 23, 2021"

      let head = [['Item','Price','Qty','Total','Returns']]
      console.log(orderList)
      let body = orderList.filter(ord => ord.custName === inv)
      console.log(body)
      body = body.map(ord => [ord.prodName,2,ord.qty,(Number(2)*Number(ord.qty))])
      

      !init && doc.addPage('0','mm','a4')

      doc.setFontSize(26);
      doc.text(leftMargin,26,"Back Porch Bakery")
      doc.setFontSize(14);
      doc.text(leftMargin,32,"849 West St., San Luis Obispo, CA 93405 (805)242-4403")
      doc.setFontSize(14);
      doc.text(rightColumn,46,`Customer:`);
      doc.setFontSize(12);
      doc.text(rightColumn,56,`${inv}`);
      doc.text(rightColumn,62,`${addr1}`);
      doc.text(rightColumn,68,`${addr2}`);
      doc.text(rightColumn,74,`${phone}`);
      
     

      doc.autoTable({
        body:[
          ["Invoice #:",`${invNum}`],
          ["PO #:",`${ponote}`],
          ["Delivery Date:",`${delivdate}`],
          ["Due Date:",`${duedate}`],
      ],
        margin: { top:80, left: leftMargin, right: leftMargin },
        styles: {fontSize: 12}
      })

      doc.autoTable({
        head: head, 
        body: body,
        margin: { top:110, left: leftMargin, right: leftMargin },
        styles: {fontSize: 12}
      }
      );

      

      init = false
      
    }
    
    
    doc.save("invoices.pdf");
  };

  const exportFullPdf = () => {
    const doc = new jsPDF('l','mm','a4');
    doc.setFontSize(24);
    doc.text(10,20,'Delivery Sheet');
    doc.autoTable({
      columns: exportColumns, 
      body: data,
      margin: { top:26 },
      styles: {fontSize: 16}
    }
    );
    doc.save("products.pdf");
  };



  const header = (
    <ButtonContainer>
    <ButtonWrapper>
        
        <Button type="button" onClick={exportListPdf} className="p-button-success" data-pr-tooltip="PDF">Print Delivery List</Button>
        <Button type="button" onClick={exportInvPdf} className="p-button-success" data-pr-tooltip="PDF">Print Invoices</Button>
        <Button type="button" onClick={exportFullPdf} className="p-button-success" data-pr-tooltip="PDF">Print Full Delivery Lists</Button>
       
    </ButtonWrapper>
    </ButtonContainer>
);

const onRowReorder = (e) => {
  setData(e.value);
}

  return (
    <div>
      <div className="card">
        <DataTable header={header} ref={dt}
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={data}
          resizableColumns
          columnResizeMode="fit"
          onRowReorder={onRowReorder}
        >
          <Column rowReorder style={{width: '3em'}} />
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
};

export default RouteGrid;
