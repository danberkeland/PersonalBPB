import React, { useContext } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";

const clonedeep = require("lodash.clonedeep");

const InputBox = styled.div`
  width: 50%;
`;

const Product = ({ order }) => {
  const {
    currentCartList,
    setCurrentCartList,
  } = useContext(CurrentDataContext);
  const { setModifications } = useContext(ToggleContext);


  const handleQtyModify = (prodName, qty) => {
    let cartToMod = clonedeep(currentCartList);
    let ind = cartToMod.findIndex((cur) => cur["prodName"] === prodName);
    cartToMod[ind]["qty"] = qty;

    setCurrentCartList(cartToMod);
    setModifications(true);
  };

  return (
    <React.Fragment>
      <label key={uuidv4()}>{order["prodName"]}</label>
      <InputBox>
        <input
          type="text"
          size="3"
          maxLength="4"
          key={uuidv4() + "c"}
          id={order["prodName"] + "item"}
          name={order["prodName"]}
          data-qty={order["qty"]}
          placeholder={order["qty"]}
          onKeyUp={(e) => {
            handleQtyModify(order["prodName"], Number(e.target.value));
          }}
          onBlur={(e) => {
            e.target.value = null;
          }}
        ></input>
      </InputBox>
    </React.Fragment>
  );
};

export default Product;
