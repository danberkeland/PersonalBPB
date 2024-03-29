import React, { useState } from "react";

import ProductList from "./AddCartEntryParts/ProductList";
import Quantity from "./AddCartEntryParts/Quantity";
import AddProduct from "./AddCartEntryParts/AddProduct";

import styled from "styled-components";

const AddProductButtons = styled.div`
  display: flex;
  width: 100%;
  margin: 20px 0;
  justify-content: space-around;
  background-color: lightgrey;
  padding: 10px 0;
`;

const AddCartEntryItem = ({ database, setDatabase, authType }) => {
  const [pickedProduct, setPickedProduct] = useState();

  return (
    <AddProductButtons>
      <ProductList
        database={database}
        pickedProduct={pickedProduct}
        setPickedProduct={setPickedProduct}
        authType={authType}
      />
      <Quantity authType={authType}/>
      <AddProduct
        database={database}
        setDatabase={setDatabase}
        pickedProduct={pickedProduct}
        setPickedProduct={setPickedProduct}
        authType={authType}
      />
    </AddProductButtons >
  );
};

export default AddCartEntryItem;
