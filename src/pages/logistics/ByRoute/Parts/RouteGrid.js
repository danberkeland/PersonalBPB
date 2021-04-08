import React, { useContext, useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';

import jsPDF from 'jspdf'
import 'jspdf-autotable'

import { ProductsContext } from "../../../../dataContexts/ProductsContext";
import { OrdersContext } from "../../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../../dataContexts/StandingContext";

import {
  buildProductArray,
  createColumns,
  createListOfCustomers,
  createQtyGrid,
} from "../../../../helpers/delivGridHelpers";

const RouteGrid = ({ route, orderList }) => {
  const { products } = useContext(ProductsContext);
  const { orders } = useContext(OrdersContext);
  const { standing } = useContext(StandingContext);

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

  const exportPdf = () => {
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
    <div className="p-d-flex export-buttons">
        
        <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="PDF" />
       
    </div>
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
