import React, { useState, useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { ToggleContext } from "../../../dataContexts/ToggleContext";
import {
  CustomerContext,
  CustomerLoad,
} from "../../../dataContexts/CustomerContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";

const DelivOrder = () => {
  let { setIsLoading } = useContext(ToggleContext);

  const [customerList, setCustomerList] = useState();

  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext);
  const { setProdLoaded } = useContext(ProductsContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  useEffect(() => {
    if (!customers) {
      setCustLoaded(false);
    }
    setProdLoaded(true);
    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  useEffect(() => {
      let custFilt
      custFilt = customers.filter(cust => cust.zoneName !== "slopick" &&
      cust.zoneName !== "atownpick" &&
      cust.zoneName !== "Prado Retail" &&
      cust.zoneName !== "Carlton Retail") 
      setCustomerList(custFilt)

  },[customers])

  useEffect(() => {
    console.log(customerList)
  },[customerList])

  const columns = [
    { field: "custName", header: "Customer" },
    { field: "zoneName", header: "Zone" },
    { field: "addr1", header: "Address" },
    { field: "city", header: "City" },
  ];

  console.log("customers", customers);
  console.log("customerList", customerList);

  const dynamicColumns = columns.map((col, i) => {
    return (
      <Column
        key={col.field}
        columnKey={col.field}
        field={col.field}
        header={col.header}
      />
    );
  });

  const onRowReorder = (e) => {
    setCustomerList(e.value);
  };

  return (
    <React.Fragment>
      {!custLoaded ? <CustomerLoad /> : ""}
      <div>
        <div className="card">
          <DataTable
            value={customerList}
            
            
            
           
            onRowReorder={onRowReorder}
          >
            <Column rowReorder style={{ width: "3em" }} />

            <Column
        field="custName"
        header="customer"
      ></Column>
      <Column
        field="zoneName"
        header="Zone"
        
      ></Column>
      <Column
        field="addr1"
        header="Address"
      ></Column>
      <Column
        field="city"
        header="City"
      ></Column>
      
          </DataTable>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DelivOrder;
