import React, { useState, useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

import "./style.css";

import {
  updateCustomer,
  updateAltPricing,
  createAltPricing,
} from "../../../graphql/mutations";

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

import { fetchAltPricing } from "../../../helpers/databaseFetchers";

const clonedeep = require("lodash.clonedeep");

const CustProds = () => {
  let { setIsLoading, modifications, setModifications } =
    useContext(ToggleContext);

  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext);
  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);

  const [productList, setProductList] = useState(products);
  const [customerGroup, setCustomerGroup] = useState(customers);
  const [altPricing, setAltPricing] = useState();

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
    setChosen("");
  }, []);

  useEffect(() => {
    try {
      let newProdList = clonedeep(products);
      for (let prod of newProdList) {
        prod.updatedRate =
          products[
            products.findIndex((up) => up.prodName === prod.prodName)
          ].wholePrice;
        for (let alt of altPricing) {
          if (alt.custName === chosen && alt.prodName === prod.prodName) {
            prod.updatedRate = alt.wholePrice;
          }
        }
        let customChecks =
          customers[customers.findIndex((custo) => chosen === custo.custName)]
            .customProd;

            let templateChecks =
            customers[customers.findIndex((custo) => chosen === custo.custName)]
              .templateProd;

        prod.prePop = false

        for (let check of customChecks) {
          if (prod.prodName === check) {
            prod.defaultInclude = !prod.defaultInclude;
          }
        }

        for (let check of templateChecks) {
          if (prod.prodName === check) {
            prod.prePop = true;
          }
        }

        

        prod.prev = prod.updatedRate;
      }
      setProductList(newProdList);
    } catch {
      console.log("not ready yet");
    }
  }, [products, altPricing, customers, chosen]);

  useEffect(() => {
    setIsLoading(true);
    fetchAltPricing().then((data) => setAltPricing(data));
    setIsLoading(false);
  }, []);

  const isIncluded = (data) => {
    return (
      <React.Fragment>
        <Checkbox
          inputId="binary"
          checked={data.defaultInclude}
          onChange={(e) => handleCheck(e, data.prodName)}
        />
      </React.Fragment>
    );
  };

  const prePop = (data) => {
    return (
      <React.Fragment>
        <Checkbox
          inputId="binary"
          checked={data.prePop}
          onChange={(e) => handlePrePopCheck(e, data.prodName)}
        />
      </React.Fragment>
    );
  };

  const handleCheck = (e, prodName) => {
    let prodListToUpdate = clonedeep(productList);
    prodListToUpdate[
      productList.findIndex((prod) => prod.prodName === prodName)
    ].defaultInclude = e.target.checked;
    setProductList(prodListToUpdate);
    setModifications(true);
  };

  const handlePrePopCheck = (e, prodName) => {
    let prodListToUpdate = clonedeep(productList);
    prodListToUpdate[
      productList.findIndex((prod) => prod.prodName === prodName)
    ].prePop = e.target.checked;
    setProductList(prodListToUpdate);
    setModifications(true);
  };

  const handleRateChange = (e, prodName) => {
    if (e.code === "Enter") {
      setModifications(true);
     
      let prodListToUpdate = clonedeep(productList);
      prodListToUpdate[
        productList.findIndex((prod) => prod.prodName === prodName)
      ].updatedRate = e.target.value;
      setProductList(prodListToUpdate);
    }
  };

  const handleRateBlurChange = (e, prodName) => {
    setModifications(true);
    
    let prodListToUpdate = clonedeep(productList);
    prodListToUpdate[
      productList.findIndex((prod) => prod.prodName === prodName)
    ].updatedRate = Number(e.target.value).toFixed(2);
    setProductList(prodListToUpdate);
   
  };

  const changeRate = (data) => {
    return (
      <InputNumber
        placeholder={data.updatedRate}
        value={data.updatedRate}
        size="4"
        mode="decimal"
        locale="en-US"
        minFractionDigits={2}
        onKeyDown={(e) => handleRateChange(e, data.prodName)}
        onBlur={(e) => handleRateBlurChange(e, data.prodName)}
      />
    );
  };

  const wholeData = (data) => {
    let stockClassName = data.wholePrice !== data.updatedRate ? "instock" : "";
    return <div className={stockClassName}>{data.wholePrice}</div>;
  };

  const setPrev = (data) => {
    if (data.prev === data.updatedRate) {
      return "";
    } else {
      return <div>{Number(data.prev).toFixed(2)}</div>;
    }
  };

  const handleChosen = (chose) => {
    let newProdList = clonedeep(products);
    for (let prod of newProdList) {
      prod.updatedRate =
        products[
          products.findIndex((up) => up.prodName === prod.prodName)
        ].wholePrice;
      for (let alt of altPricing) {
        if (alt.custName === chosen && alt.prodName === prod.prodName) {
          prod.updatedRate = alt.wholePrice;
        }
      }

      // find chosen customer
      // for cust of customProd, invert check

      prod.prev = prod.updatedRate;
    }
    setProductList(newProdList);
    setChosen(chose);
  };

  const rowClass = (data) => {
    return {
      "not-included": data.defaultInclude === false,
      "price-differ": data.wholePrice !== data.updatedRate,
    };
  };

  const updateCustProd = async () => {
    let customProd = [];
    let templateProd = []
    
    for (let prod of productList) {
      let prodDefaultInclude = clonedeep(
        products[products.findIndex((p) => p.prodName === prod.prodName)]
          .defaultInclude)

      if (prod.prev !== prod.updatedRate) {
        prod.prev = prod.updatedRate;
        const updateDetails = {
          custName: chosen,
          prodName: prod.prodName,
          wholePrice: prod.updatedRate,
        };

        let exists = false;
        for (let alt of altPricing) {
          if (
            alt.custName === chosen &&
            alt.prodName === prod.prodName &&
            alt.wholePrice !== prod.updatedRate
          ) {
            console.log("update altpricing");
            exists = true;
            updateDetails["id"] = alt.id;

            try {
              const prodData = await API.graphql(
                graphqlOperation(updateAltPricing, {
                  input: { ...updateDetails },
                })
              );
            } catch (error) {
              console.log("error on fetching Prod List", error);
            }
          }
        }
        if (exists === false) {
          console.log("create altpricing");
          try {
            const prodData = await API.graphql(
              graphqlOperation(createAltPricing, {
                input: { ...updateDetails },
              })
            );
          } catch (error) {
            console.log("error on fetching Prod List", error);
          }
        }
      }

      if (prod.defaultInclude !== prodDefaultInclude) {
        customProd.push(prod.prodName);
        
      }
      if (prod.prePop){
        templateProd.push(prod.prodName)
        
        
      }
    }
   
      let id =
        customers[customers.findIndex((custo) => custo.custName === chosen)].id;
      const updateDetails = {
        id: id,
        customProd: customProd,
        templateProd: templateProd
      };
      try {
        const prodData = await API.graphql(
          graphqlOperation(updateCustomer, {
            input: { ...updateDetails },
          })
        );
      } catch (error) {
        console.log("error on updating Customer", error);
      }
    
    setModifications(false);
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
        onClick={updateCustProd}
        className={
          modifications
            ? "p-button-raised p-button-rounded p-button-danger"
            : "p-button-raised p-button-rounded p-button-success"
        }
      />
      {chosen !== "" ? (
        <div className="orders-subtable">
          <h2>Product Availability for {chosen}</h2>
          <DataTable
            value={productList}
            className="p-datatable-sm"
            rowClassName={rowClass}
          >
            <Column
              field="included"
              header="Included"
              body={(e) => isIncluded(e, productList)}
            ></Column>
            <Column
              field="prePop"
              header="Default Items"
              body={(e) => prePop(e, productList)}
            ></Column>
            <Column field="prodName" header="Product"></Column>
            <Column></Column>
            <Column
              field="updatedRate"
              header="Customer Rate"
              body={(e) => changeRate(e)}
            >
              {" "}
            </Column>
            <Column
              field="prev"
              header="Prev"
              className="instock"
              body={(e) => setPrev(e)}
            ></Column>
            <Column
              field="wholePrice"
              header="Default Rate"
              body={wholeData}
            ></Column>
          </DataTable>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default CustProds;
