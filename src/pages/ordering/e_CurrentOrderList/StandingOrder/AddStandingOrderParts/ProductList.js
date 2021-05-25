import React, { useState, useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";

import { Dropdown } from "primereact/dropdown";

import { findAvailableProducts } from "../../../../../helpers/sortDataHelpers";


const ProductList = ({ database, pickedProduct, setPickedProduct, productList, setProductList }) => {
  const [products, customers, routes, standing, orders] = database;
  const { chosen, delivDate } =
    useContext(CurrentDataContext);
  
  
  useEffect(() => {
    if (database.length>0){
    let availableProducts = findAvailableProducts(
      products,
      orders,
      chosen,
      delivDate
    );
    setProductList(availableProducts);
  }
  }, [database, chosen, delivDate]);

  const handleChange = (e) => {
    setPickedProduct(e.target.value.prodName);
  };

  
  return (
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
  );
};

export default ProductList;
