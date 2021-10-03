import React, { useContext, useState, useEffect } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

import { InputNumber } from 'primereact/inputnumber';

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";
import { convertDatetoBPBDate } from "../../../../../helpers/dateTimeHelpers";

const clonedeep = require("lodash.clonedeep");

const InputBox = styled.div`
  width: 50%;
`;

const Product = ({ order, database, setDatabase }) => {
  const [products, customers, routes, standing, orders] = database;
  const {
    currentCartList,
    setCurrentCartList,
    chosen,
    delivDate,
    route,
    ponote,
  } = useContext(CurrentDataContext);
  const { setModifications } = useContext(ToggleContext);

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  const updateProduct = (prodName, e) => {
    let qty = Number(e.target.value);
    let ordToMod = clonedeep(orders);
    let ind = ordToMod.findIndex(
      (ord) =>
        ord.prodName === prodName &&
        ord.custName === chosen &&
        ord.delivDate === convertDatetoBPBDate(delivDate)
    );

    if (ind > -1) {
      ordToMod[ind].qty = qty;
    } else {
      // find item in currentCartOrder
      let cartInd = currentCartList.findIndex(
        (curr) => curr.prodName === prodName
      );

      currentCartList[cartInd].route = route;
      currentCartList[cartInd].PONote = ponote;
      currentCartList[cartInd].qty = qty;

      ordToMod.push(currentCartList[cartInd]);
    }
    let DBToUpdate = clonedeep(database);
    DBToUpdate[4] = ordToMod;
    setDatabase(DBToUpdate);
    setModifications(true);
  };

  const handleQtyModify = (prodName, e) => {
    if (e.code === "Enter") {
      updateProduct(prodName, e);
    }
  };

  const handleBlur = (prodName, e) => {
    if (e.target.value) {
      updateProduct(prodName, e);
    }
  };

  const innards1 = (
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
          handleQtyModify(order["prodName"], e);
        }}
        onBlur={(e) => {
          handleBlur(order["prodName"], e);
        }}
      ></input>
    </InputBox>
  );

  const innards2 = (
    <InputNumber 
    value={order["qty"]}
    size = "2"
    style={{height: '5em'}}
    />
  
  );

  return (
    <React.Fragment>
      <label key={uuidv4()}>{order["prodName"]}</label>
      {width > breakpoint ? innards1 : innards2}
    </React.Fragment>
  );
};

export default Product;
