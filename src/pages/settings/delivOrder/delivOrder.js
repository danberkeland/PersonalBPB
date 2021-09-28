import React, { useState, useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { updateCustomer } from "../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import { ToggleContext } from "../../../dataContexts/ToggleContext";
import {
  CustomerContext,
  CustomerLoad,
} from "../../../dataContexts/CustomerContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";
import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";

const DelivOrder = () => {
  let { setIsLoading, modifications, setModifications } =
    useContext(ToggleContext);

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
    let custFilt;
    custFilt = customers.filter(
      (cust) =>
        cust.zoneName !== "slopick" &&
        cust.zoneName !== "atownpick" &&
        cust.zoneName !== "Prado Retail" &&
        cust.zoneName !== "Carlton Retail"
    );
    sortAtoZDataByIndex(custFilt,"delivOrder")
    setCustomerList(custFilt);
  }, [customers]);

  

  const columns = [
    { field: "custName", header: "Customer" },
    { field: "zoneName", header: "Zone" },
    { field: "addr1", header: "Address" },
    { field: "city", header: "City" },
  ];

  

  const onRowReorder = (e) => {
    setCustomerList(e.value);
    setModifications(true);
  };

  const updateDeliveryOrder = async () => {
    setIsLoading(true)
    let ind = 0;
    for (let cust of customerList) {
      ind=ind+1
      const updateDetails = {
        id: cust.id,
        delivOrder: ind,
      };

      try {
        await API.graphql(
          graphqlOperation(updateCustomer, { input: { ...updateDetails } })
        );
        console.log("Updated", updateDetails.id)
      } catch (error) {
        console.log("error on creating Orders", error);
        setIsLoading(false);
      }
    
    }
    setIsLoading(false)
    setModifications(false);
  };

  return (
    <React.Fragment>
      {!custLoaded ? <CustomerLoad /> : ""}
      <Button
        label="Update Delivery Order"
        icon="pi pi-plus"
        onClick={updateDeliveryOrder}
        className={
          modifications
            ? "p-button-raised p-button-rounded p-button-danger"
            : "p-button-raised p-button-rounded p-button-success"
        }
      />
      <div>
        <div className="card">
          <DataTable value={customerList} onRowReorder={onRowReorder}>
            <Column rowReorder style={{ width: "3em" }} />

            <Column field="custName" header="customer"></Column>
            <Column field="zoneName" header="Zone"></Column>
            <Column field="addr1" header="Address"></Column>
            <Column field="city" header="City"></Column>
          </DataTable>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DelivOrder;
