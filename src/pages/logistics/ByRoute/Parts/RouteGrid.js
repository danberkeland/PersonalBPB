import React, { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ProductsContext } from "../../../../dataContexts/ProductsContext";

import {
  buildProductArray,
  createColumns,
  createListOfCustomers,
  createQtyGrid,
} from "../../../../helpers/delivGridHelpers";



const RouteGrid = ({ route, orderList }) => {
  
  const { products } = useContext(ProductsContext);
  const { delivDate } = useContext(CurrentDataContext);

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const [ builtGrid, setBuiltGrid ] = useState()

  useEffect(()=> {
    
    if (orderList){
      let buildGridSetUp = orderList.filter(ord => ord["route"]===route)
      setBuiltGrid(buildGridSetUp)
    }
  },[route,orderList])

  
  const constructColumns = () => {
    let columns
    if(builtGrid){
    let gridToEdit = builtGrid.filter((grd) => grd["route"] === route);
    let listOfProducts = buildProductArray(gridToEdit, products);

    columns = createColumns(listOfProducts);
  }
    return columns;
  };

  const constructData = () => {
    let qtyGrid
    if (builtGrid){
    let gridToEdit = builtGrid.filter((order) => order["route"] === route);
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
  }, [delivDate, route]);

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

  
  return (
    <div>
      <div className="card">
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={data}
          resizableColumns
          columnResizeMode="fit"
        >
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
};

export default RouteGrid;
