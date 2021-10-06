import React, { useState, useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

import { findAvailableProducts } from "../../../../../helpers/sortDataHelpers";

import { Dropdown } from "primereact/dropdown";
import { confirmDialog } from 'primereact/confirmdialog'

import swal from "@sweetalert/with-react";
import styled from "styled-components";


const OptionGroup = styled.div`
  font-size: .7em;
`

const ProductList = ({ database, pickedProduct, setPickedProduct, authType }) => {
  const [products, customers, routes, standing, orders] = database;
  const { chosen, delivDate, currentCartList } = useContext(CurrentDataContext);
  const { deadlinePassed } = useContext(ToggleContext)

  const [productList, setProductList] = useState();

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

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
      targ.prodName = targ.prodName.slice(0, -16);
      confirmDialog({
        message: 'This product is already in production.  We will do our best but we cannot guarantee delivery.  Rush fee may apply. Continue?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => setPickedProduct(targ)
    });
    } else {
      setPickedProduct(targ)
    }
    
    
  };

  

  const itemTemplate = (option) => {
    console.log(option)
    return width>breakpoint ? option.prodName : <OptionGroup>{option.prodName}</OptionGroup>
  }

  return (
    <Dropdown
      options={productList}
      optionLabel="prodName"
      itemTemplate = {itemTemplate}
      placeholder="Select a product"
      name="products"
      value={pickedProduct}
      onChange={handleChange}
      disabled={chosen === "  " || (deadlinePassed && authType !== "bpbadmin") ? true : false}
    />
  );
};

export default ProductList;
