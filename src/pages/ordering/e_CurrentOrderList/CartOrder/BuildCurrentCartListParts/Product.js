import React, { useContext } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

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
    delivDate
  } = useContext(CurrentDataContext);
  const { setModifications } = useContext(ToggleContext);


  const handleQtyModify = (prodName, e) => {
    if (e.code === "Enter"){
    let qty = Number(e.target.value)
    let ordToMod = clonedeep(orders)
    let ind = ordToMod.findIndex(ord => ord.prodName === prodName && ord.custName === chosen && ord.delivDate === convertDatetoBPBDate(delivDate))
    console.log(ind)
    if (ind>-1){
    ordToMod[ind].qty = qty;
    } else {
      // find item in currentCartOrder
      // adjust item qty and SO
      // add item to orders
    }
    let DBToUpdate = clonedeep(database)
    DBToUpdate[4] = ordToMod
    setDatabase(DBToUpdate)
    setModifications(true);
    }
  };

  const handleBlur = (prodName, e) => {
    if (e.target.value){
    let qty = Number(e.target.value)
    let ordToMod = clonedeep(orders)
    let ind = ordToMod.findIndex(ord => ord.prodName === prodName && ord.custName === chosen && ord.delivDate === convertDatetoBPBDate(delivDate))
    console.log(ind)
    if (ind>-1){
      ordToMod[ind].qty = qty;
      } else{
        // find item in currentCartOrder
        // adjust item qty and SO
        // add item to orders
      }
    let DBToUpdate = clonedeep(database)
    DBToUpdate[4] = ordToMod
    setDatabase(DBToUpdate)
    setModifications(true);
  }
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
            handleQtyModify(order["prodName"], e);
          }}
          onBlur={(e) => {
            handleBlur(order["prodName"], e);
          }}
        ></input>
      </InputBox>
    </React.Fragment>
  );
};

export default Product;
