import React, { useState } from "react";

import AddProduct from "./AddStandingOrderParts/AddProduct";
import ProductList from "./AddStandingOrderParts/ProductList";
import StandOrHold from "./AddStandingOrderParts/StandOrHold";

import styled from "styled-components";

const AddProductButtons = styled.div`
  display: flex;
  width: 100%;
  margin: 20px 0;
  justify-content: space-around;
  background-color: lightgrey;
  padding: 10px 0;
`;

const AddStandingOrderEntryItem = ({ database, authType }) => {
  const [standHold, setStandHold] = useState();
  const [pickedProduct, setPickedProduct] = useState();
  const [productList, setProductList] = useState();

  return (
    <AddProductButtons>
      <ProductList
        database={database}
        pickedProduct={pickedProduct}
        setPickedProduct={setPickedProduct}
        productList={productList}
        setProductList={setProductList}
      />
      <AddProduct
        database={database}
        pickedProduct={pickedProduct}
        setPickedProduct={setPickedProduct}
      />
      {authType === "bpbadmin" ? <StandOrHold
        database={database}
        standHold={standHold}
        setStandHold={setStandHold}
      /> : ''}
    </AddProductButtons>
  );
};

export default AddStandingOrderEntryItem;
