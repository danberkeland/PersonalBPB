import React, { useEffect, useState, useContext } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

import { formatter, getRate } from "../../../../../helpers/billingGridHelpers";
import { API, graphqlOperation } from "aws-amplify";

import { updateOrder, createOrder } from "../../../../../graphql/mutations";

import styled from "styled-components";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";
import { convertDatetoBPBDate } from "../../../../../helpers/dateTimeHelpers";

const clonedeep = require("lodash.clonedeep");

const FooterGrid = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 10px;
  align-items: center;
`;

export const GrandTotal = ({
  rowData,
  dailyInvoices,
  setDailyInvoices,
  products,
  altPricing,
  pickedProduct,
  setPickedProduct,
  pickedQty,
  setPickedQty,
  pickedRate,
  setPickedRate,
  delivDate,
  orders
}) => {
  const [custo, setCusto] = useState("Big Sky Cafe");
  const { setReload, reload, setIsLoading, modifications, setModifications } =
    useContext(ToggleContext);

  useEffect(() => {
    let order = {};
    order["rate"] = -1;
    // getOrder info from invNum
    order["custName"] = custo;
    order["prodName"] = pickedProduct;
    let rate;
    try {
      rate = getRate(products, order, altPricing);
      console.log("rate", rate);
    } catch {
      rate = 0;
    }

    console.log("rate", rate);
    setPickedRate(rate);
  }, [pickedProduct]);

  const handleAddProduct = (e, invNum) => {
    setModifications(true);
    let invToModify = clonedeep(dailyInvoices);
    let ind = invToModify.findIndex((inv) => inv["invNum"] === invNum);

    let prodToAdd = {
      prodName: pickedProduct,
      qty: parseInt(pickedQty),
      rate: parseFloat(pickedRate),
    };
    invToModify[ind].orders.push(prodToAdd);
    setDailyInvoices(invToModify);
    setPickedProduct("");
    setPickedQty(0);
    setPickedRate(0);
  };
  let data = rowData.orders;
  let invNum = rowData.invNum;
  let sum = 0;

  try {
    for (let i of data) {
      sum = sum + Number(i.qty) * Number(i.rate);
    }

    sum = formatter.format(sum);
  } catch {
    console.log("nothing to calc");
  }

  const handlePickedProd = (e, invNum) => {
    let cust =
      dailyInvoices[dailyInvoices.findIndex((daily) => daily.invNum === invNum)]
        .custName;
    setCusto(cust);
    setPickedProduct(e.target.value.prodName);
  };

  const handleSaveChanges = async (e, invNum) => {
   
    // loop through orders
    let custInd = dailyInvoices.findIndex(daily => daily.invNum === invNum)
    let parsedOrders = dailyInvoices[custInd].orders.filter(daily => daily.prodName !== "DELIVERY");
   
    let custName=dailyInvoices[custInd].custName;
    let filteredOrders = orders.filter(ord => ord.custName===custName && ord.delivDate===convertDatetoBPBDate(delivDate))
    console.log("filteredOrders",filteredOrders)

    for (let ord of parsedOrders) {
      let id
      let ind = filteredOrders.findIndex(filt => filt.prodName === ord.prodName)
      ind<0 ? id = null : id = filteredOrders[ind].id
     
      let updateDetails = {
       
        qty: ord.qty,
        prodName: ord.prodName,
        custName: custName,
        rate: ord.rate,
        SO: ord.qty,
        delivDate: convertDatetoBPBDate(delivDate)
        
      };
      console.log(updateDetails)
     
      if (id !== null) {
        updateDetails["id"] = id
        try {
          await API.graphql(
            graphqlOperation(updateOrder, { input: { ...updateDetails } })
          );
          console.log(updateDetails.prodName, "Successful update");
        } catch (error) {
          console.log(error, "Failed Update");
        }
      } else {
        
        try {
          await API.graphql(
            graphqlOperation(createOrder, { input: { ...updateDetails } })
          );
          console.log(updateDetails.prodName, "Successful create");
        } catch (error) {
          console.log(error, "Failed create");
        }
      }
    
    }

    setReload(!reload);
    setIsLoading(false);
    
    setModifications(false);
  };

  return (
    <React.Fragment>
      <FooterGrid>
        <Button onClick={(e) => handleAddProduct(e, invNum)}>ADD +</Button>
        <label>Product</label>
        <Dropdown
          optionLabel="prodName"
          options={products}
          placeholder={pickedProduct}
          name="products"
          value={pickedProduct}
          onChange={(e) => handlePickedProd(e, invNum)}
        />
        <label>Quantity</label>
        <InputNumber
          id="addQty"
          placeholder={pickedQty}
          value={pickedQty}
          size="4"
          onKeyDown={(e) => e.code === "Enter" && setPickedQty(e.target.value)}
          onBlur={(e) => setPickedQty(e.target.value)}
        />
        <label>Rate</label>
        <InputNumber
          id="addRate"
          placeholder={pickedRate}
          value={pickedRate}
          size="4"
          mode="decimal"
          locale="en-US"
          minFractionDigits={2}
          onKeyDown={(e) => e.code === "Enter" && setPickedRate(e.target.value)}
          onBlur={(e) => setPickedRate(e.target.value)}
        />
      </FooterGrid>
      <FooterGrid>
        {modifications ? (
          <React.Fragment>
            <Button
              className={
                modifications
                  ? "p-button-raised p-button-rounded p-button-danger"
                  : "p-button-raised p-button-rounded p-button-success"
              }
              onClick={(e) => handleSaveChanges(e, invNum)}
            >
              SAVE CHANGES
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div></div>
          </React.Fragment>
        )}
        <div></div>
        <div>Grand Total</div>
        <div>{sum}</div>
        <div></div>
      </FooterGrid>
    </React.Fragment>
  );
};
