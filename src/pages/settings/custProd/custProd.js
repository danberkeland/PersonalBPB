import React, { useState, useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

import { updateCustomer } from "../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import { ToggleContext } from "../../../dataContexts/ToggleContext";
import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import {
  CustomerContext,
  CustomerLoad,
} from "../../../dataContexts/CustomerContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import {
  ProductsContext,
  ProductsLoad,
} from "../../../dataContexts/ProductsContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";

const DelivOrder = () => {
  let { setIsLoading, modifications, setModifications } =
    useContext(ToggleContext);

  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext);
  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);

  const [productList, setProductList] = useState(products);
  const [customerGroup, setCustomerGroup] = useState(customers);

  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  const {
    chosen,

    setChosen,
  } = useContext(CurrentDataContext);

  useEffect(() => {
    if (customers.length > 0) {
      setCustomerGroup(customers);
    }
  }, [customers]);

  useEffect(() => {
    if (!products) {
      setProdLoaded(false);
    }
    if (!customers) {
      setCustLoaded(false);
    }

    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  useEffect(() => {
    console.log(productList);
  }, [productList]);

  const isIncluded = (e) => {
    console.log(e.defaultInclude);
    return (
      <React.Fragment>
        <Checkbox inputId="binary" checked={e.defaultInclude} />
      </React.Fragment>
    );
  };

  const changeRate = (data) => {
    return (
      <InputNumber
        placeholder={data.wholePrice}
        value={data.wholePrice}
        size="4"
        mode="decimal"
        locale="en-US"
        minFractionDigits={2}
        //onKeyDown={(e) => handleRateChange(e, data, invNum)}
        //onBlur={(e) => handleRateBlurChange(e, data, invNum)}
      />
    );
  };

  const handleChosen = (chosen) => {
    setChosen(chosen);
  };

  return (
    <React.Fragment>
      {!prodLoaded ? <ProductsLoad /> : ""}
      {!custLoaded ? <CustomerLoad /> : ""}
      <Dropdown
        id="customers"
        value={chosen}
        options={customerGroup}
        optionLabel="custName"
        placeholder={chosen === "  " ? "Select a Customer ..." : chosen}
        onChange={(e) => handleChosen(e.value.custName)}
      />
      <Button
        label="Update Customer Products"
        icon="pi pi-plus"
        // onClick={updateDeliveryOrder}
        className={
          modifications
            ? "p-button-raised p-button-rounded p-button-danger"
            : "p-button-raised p-button-rounded p-button-success"
        }
      />
      <div className="orders-subtable">
        <h2>Product Availability for {chosen}</h2>
        <DataTable value={productList} className="p-datatable-sm">
          <Column
            field="included"
            header="Included"
            body={(e) => isIncluded(e, productList)}
          ></Column>
          <Column
            field="prodName"
            header="Product"
            value={productList.prodName}
          ></Column>
          <Column></Column>
          <Column field="rate" header="Rate" body={(e) => changeRate(e)}>
            {" "}
          </Column>
          <Column
            field="wholePrice"
            header="Default Rate"
            
          ></Column>
        </DataTable>
      </div>
    </React.Fragment>
  );
};

export default DelivOrder;
