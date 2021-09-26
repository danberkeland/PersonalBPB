import React, { useState, useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";

import { findAvailableProducts } from "../../../../../helpers/sortDataHelpers";

import { Dropdown } from "primereact/dropdown";

const ProductList = ({ database, pickedProduct, setPickedProduct }) => {
  const [products, customers, routes, standing, orders] = database;
  const { chosen, delivDate, currentCartList } = useContext(CurrentDataContext);

  const [productList, setProductList] = useState();

  useEffect(() => {
    if (database.length>0 && currentCartList){
    let availableProducts = findAvailableProducts(
      products,
      currentCartList,
      chosen,
      delivDate,
      customers
    );
    setProductList(availableProducts);
  }
  }, [database, chosen, delivDate, currentCartList]);

  const handleChange = (e) => {
    setPickedProduct(e.target.value);
  };

  return (
    <Dropdown
      options={productList}
      optionLabel="prodName"
      placeholder="Select a product"
      name="products"
      value={pickedProduct}
      onChange={handleChange}
      disabled={chosen !== "  " ? false : true}
    />
  );
};

export default ProductList;
