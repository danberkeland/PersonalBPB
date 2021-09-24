import React, { useState, useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import {Checkbox} from 'primereact/checkbox';
import { InputNumber } from "primereact/inputnumber";

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


const DelivOrder = () => {
  let { setIsLoading, modifications, setModifications } =
    useContext(ToggleContext);

  const [customerList] = useState();

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
    console.log(customerList);
  }, [customerList]);

  const data = [
      {"isIncluded": true,
      "prodName": "Plain Croissant",
      "rate": 1.5},
      {"isIncluded": false,
      "prodName": "High French",
      "rate": 2.1},
]

  

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

  const isIncluded = (e) => {
      console.log(e.isIncluded)
    return (
        <React.Fragment>
            <Checkbox inputId="binary" checked={e.isIncluded}  />
      
        </React.Fragment>
        
        
      );
  }

  const changeRate = (data) => {
    return (
        <InputNumber
          placeholder={data.rate}
          value={data.rate}
          size="4"
          mode="decimal"
          locale="en-US"
          minFractionDigits={2}
          //onKeyDown={(e) => handleRateChange(e, data, invNum)}
          //onBlur={(e) => handleRateBlurChange(e, data, invNum)}
        />
      );
  }

  return (
    <React.Fragment>
      {!custLoaded ? <CustomerLoad /> : ""}
      <Button
        label="Update Customer Products"
        icon="pi pi-plus"
        onClick={updateDeliveryOrder}
        className={
          modifications
            ? "p-button-raised p-button-rounded p-button-danger"
            : "p-button-raised p-button-rounded p-button-success"
        }
      />
      <div className="orders-subtable">
      <h2>
        Product Availability for Kberg
      </h2>
      <DataTable value={data} className="p-datatable-sm">
        
        <Column 
            field="included" 
            header="Included"
            body={(e) => isIncluded(e,data)}>

        </Column>
        <Column
        field="prodName"
          header="Product"
          value={data.product}
         
        ></Column>
        <Column 
            field = "rate"
            header="Rate"
            body={(e) => changeRate(e)}
         >
          {" "}
        </Column>
        
      </DataTable>
      
    </div>
    </React.Fragment>
  );
};

export default DelivOrder;
