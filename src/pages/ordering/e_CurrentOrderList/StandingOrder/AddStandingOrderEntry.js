import React, { useState, useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { OrdersContext } from "../../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../../dataContexts/HoldingContext";
import { ProductsContext } from "../../../../dataContexts/ProductsContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { findAvailableProducts } from "../../../../helpers/sortDataHelpers";

import styled from "styled-components";

const AddProductButtons = styled.div`
  display: flex;
  width: 100%;
  margin: 20px 0;
  justify-content: space-around;
  background-color: lightgrey;
  padding: 10px 0;
`;

const clonedeep = require("lodash.clonedeep");

const AddStandingOrderEntryItem = () => {
  const { products } = useContext(ProductsContext);
  const { standing, setStanding } = useContext(StandingContext);
  const { holding, setHolding } = useContext(HoldingContext);
  const { orders } = useContext(OrdersContext);
  const { chosen, delivDate, standArray, setStandArray } = useContext(CurrentDataContext);
  const { standList, setStandList } = useContext(ToggleContext);

  const [pickedProduct, setPickedProduct] = useState();
  const [productList, setProductList] = useState();

  const [standHold, setStandHold] = useState();

  useEffect(() => {
    standList ? setStandHold("MAKE H.O.") : setStandHold("MAKE S.O.");
  }, [standList]);

  useEffect(() => {
    let availableProducts = findAvailableProducts(
      products,
      orders,
      chosen,
      delivDate
    );
    setProductList(availableProducts);
  }, [products, orders, chosen, delivDate]);

  const handleChange = (e) => {
    setPickedProduct(e.target.value.prodName);
  };

  const handleAdd = () => {
    let newList = clonedeep(standArray);

    if (pickedProduct !== "" && pickedProduct) {
      
        let newOrder = {
          prodName: pickedProduct,
          custName: chosen,
          isStand: standList ? true : false,
          Sun: 0,
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
        };
        newList.push(newOrder);
      
    }
    setStandArray(newList);

    setPickedProduct("");
  };

  const handleStandHold = () => {
      let newStand = !standList
      console.log(newStand)
      setStandList(newStand);
    
  };

  return (
    <AddProductButtons>
      <Dropdown
        options={productList}
        optionLabel="prodName"
        placeholder={
          pickedProduct === "" ? "Select a Product ..." : pickedProduct
        }
        value={pickedProduct}
        onChange={handleChange}
        disabled={chosen !== "  " ? false : true}
      />
      <Button
        label="ADD"
        disabled={chosen === "  " || pickedProduct === ""}
        icon="pi pi-plus"
        onClick={handleAdd}
      />

      <Button
        className={
          !standList
            ? "p-button-raised p-button-rounded p-button-danger"
            : "p-button-raised p-button-rounded p-button-success"
        }
        onClick={handleStandHold}
        label={standHold}
      />
    </AddProductButtons>
  );
};

export default AddStandingOrderEntryItem;
