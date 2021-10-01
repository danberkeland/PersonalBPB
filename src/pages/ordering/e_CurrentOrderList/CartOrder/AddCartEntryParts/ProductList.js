import React, { useState, useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";

import { findAvailableProducts } from "../../../../../helpers/sortDataHelpers";

import { Dropdown } from "primereact/dropdown";

import swal from "@sweetalert/with-react";

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
    let targ = e.target.value;

    if (targ.prodName.includes("IN PRODUCTION")) {
      targ.prodName = targ.prodName.slice(0, -15);
      swal({
        text: `This product is already in Production.  We will do our best but we cannot guarantee delivery.  Rush fee may apply.`,
        icon: "warning",
        buttons: false,
        timer: 6000,
      });
    }
    setPickedProduct(targ);
    
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
