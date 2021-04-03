import React, { useState, useContext } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

import { ProductsContext } from "../../../dataContexts/ProductsContext";

import { formatter } from "../../../helpers/billingGridHelpers";

import styled from "styled-components";

const FooterGrid = styled.div`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 10px;
  align-items: center;
`;

const clonedeep = require("lodash.clonedeep");

export const GrandTotal = ({ invoices, setInvoices, data, invNum }) => {
    /*
  const [pickedProduct, setPickedProduct] = useState();
  const [pickedRate, setPickedRate] = useState();
  const [pickedQty, setPickedQty] = useState();

  const { products } = useContext(ProductsContext);

  const handleAddProduct = (e, invNum) => {
    let invToModify = clonedeep(invoices);
    let ind = invToModify.findIndex((inv) => inv["invNum"] === invNum);
    let prodToAdd = {
      prodName: pickedProduct,
      qty: pickedQty,
      rate: pickedRate,
    };
    invToModify[ind].orders.push(prodToAdd);
    setInvoices(invToModify);
    setPickedProduct("");
    setPickedQty(0);
    setPickedRate(0);
  };

  let sum = 0;

  try {
    for (let i of data) {
      sum = sum + Number(i.qty) * Number(i.rate);
    }

    sum = formatter.format(sum);
  } catch {
    console.log("nothing to calc");
  }
*/
  return (
      <h1>Testing</h1>
    /*
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
          onChange={(e) => setPickedProduct(e.target.value.prodName)}
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
        <div></div>
        <div></div>
        <div>Grand Total</div>
        <div>{sum}</div>
        <div></div>
      </FooterGrid>
          </React.Fragment>*/
  );
};


