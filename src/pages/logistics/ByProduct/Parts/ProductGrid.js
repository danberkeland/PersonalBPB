import React, { useState, useEffect, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import {
  buildCartList,
  buildStandList,
  compileFullOrderList,
} from "../../../../helpers/CartBuildingHelpers";


const ProductGrid = ({ delivDate,
  setDelivDate,
  prodGridData,
  database }) => {
  
  const [ customers, setCustomers ] = useState(database.customers);
  const [ routes, setRoutes ] = useState(database.routes)
  const [ products, setProducts ] = useState(database.products);
  const [ orders, setOrders ] = useState(database.orders);
  const [ standing, setStanding ] = useState(database.standing);
  const { setIsLoading } = useContext(ToggleContext);

  const [builtGrid, setBuiltGrid] = useState();

  const tryZone = (grd) => {
    let zone
    try{
    zone =
      customers[
        customers.findIndex(
          (cust) => cust["custName"] === grd["custName"]
        )
      ]["zoneName"];
    } catch {
      zone = ''
    }
    return zone;
  };

  const tryNick = (grd) => {
    let nick
    try{
    nick =
      customers[
        customers.findIndex(
          (cust) => cust["custName"] === grd["custName"]
        )
      ]["nickName"];
    } catch {
      nick = ''
    }
    return nick;
  };

  useEffect(() => {
    if (orders && standing && customers && products && delivDate) {
      
      try {
        let buildOrders = buildCartList("*", delivDate, orders);
        let buildStand = buildStandList("*", delivDate, standing);
        let fullOrder = compileFullOrderList(buildOrders, buildStand);
        
        let builtGridSetup = fullOrder.filter((ord) => ord["qty"] !== 0);
        
        
        builtGridSetup.forEach(
          (grd) => (grd["zoneName"] = tryZone(grd))
             &&
            (grd["nickName"] =
              products[
                products.findIndex(
                  (prod) => prod["prodName"] === grd["prodName"]
                )
              ]["nickName"]) &&
            (grd["custNick"] = tryNick(grd)) &&
            (grd["forBake"] =products[
              products.findIndex(
                (prod) => prod["prodName"] === grd["prodName"]
              )
            ]["forBake"])

            
        );
        
        setIsLoading(false);
        setBuiltGrid(builtGridSetup);
      } catch {
        console.log("Whoops");
      }
    }
  }, [delivDate, orders, standing, customers, products]);

  const headerTemplate = (data) => {
    return (
      <React.Fragment>
        <h3>{data.zoneName}</h3>
      </React.Fragment>
    );
  };

  const footerTemplate = (data) => {
    return <React.Fragment></React.Fragment>;
  };

  return (
    <DataTable
      value={builtGrid}
      rowGroupMode="subheader"
      groupField="zoneName"
      sortMode="single"
      sortField="zoneName"
      sortOrder={1}
      className="p-datatable-striped"
      rowGroupHeaderTemplate={headerTemplate}
      rowGroupFooterTemplate={footerTemplate}
    >
      <Column
        field="zoneName"
        header="Zone"
        filter
        filterPlaceholder="Search by zone"
      ></Column>
      <Column
        field="prodName"
        header="Product"
        filter
        filterPlaceholder="Search by product"
      ></Column>
      <Column
        field="nickName"
        header="Prod nick"
        filter
        filterPlaceholder="Search by nickname"
      ></Column>
      <Column
        field="forBake"
        header="For Bake"
        filter
        filterPlaceholder="Search by forBake"
      ></Column>
      <Column
        field="custName"
        header="Customer"
        filter
        filterPlaceholder="Search by customer"
      ></Column>
      <Column
        field="custNick"
        header="Cust nick"
        filter
        filterPlaceholder="Search by nickname"
      ></Column>
      <Column field="qty" header="Quantity"></Column>
    </DataTable>
  );
};
export default ProductGrid;
