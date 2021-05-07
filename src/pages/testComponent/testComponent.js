import React, { useContext, useEffect, useState } from "react";

import { CustomerContext } from "../../dataContexts/CustomerContext";
import { ProductsContext } from "../../dataContexts/ProductsContext";
import { HoldingContext } from "../../dataContexts/HoldingContext";
import { OrdersContext } from "../../dataContexts/OrdersContext";
import { StandingContext } from "../../dataContexts/StandingContext";
import { RoutesContext } from "../../dataContexts/RoutesContext";

import DatabaseServices from './databaseServices';

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";



function TestComponent() {
    const [products, setProducts] = useState([]);
    const databaseServices = new DatabaseServices();

  const { setProdLoaded } = useContext(ProductsContext);
  const { setCustLoaded } = useContext(CustomerContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);
  let { setRoutesLoaded } = useContext(RoutesContext);

  useEffect(() => {
    databaseServices.getProducts().then(data => setProducts(data));
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setRoutesLoaded(true);
    setProdLoaded(true);
    setCustLoaded(true);
    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  return (
    <div>
      <div className="card">
        <DataTable value={products}>
          <Column field="prodName" header="Name"></Column>
          <Column field="nickName" header="Nick Name"></Column>
          <Column field="packSize" header="Pack Size"></Column>
          <Column field="doughType" header="Dough Type"></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default TestComponent;
