import React, { useContext, useState, useEffect } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

import { InputNumber } from "primereact/inputnumber";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";
import { convertDatetoBPBDate } from "../../../../../helpers/dateTimeHelpers";

const { DateTime, Interval } = require("luxon");

const clonedeep = require("lodash.clonedeep");

const InputBox = styled.div`
  width: 50%;
`;

const Title = styled.h3`
  padding: 0;
  margin: 5px 10px;
  color: rgb(66, 97, 201);
`;

const Product = ({ order, database, setDatabase, authType }) => {
  const [products, customers, routes, standing, orders] = database;
  const {
    currentCartList,
    setCurrentCartList,
    chosen,
    delivDate,
    route,
    ponote,
  } = useContext(CurrentDataContext);
  const { setModifications, deadlinePassed } = useContext(ToggleContext);

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  const updateProduct = (prodName, e) => {
    let qty = Number(e);
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
      updateProduct(prodName, e.target.value);
    }
  };

  const handleBlur = (prodName, e) => {
    if (e.value) {
      updateProduct(prodName, e.value);
    }
  };

  const checkAvailability = (prod) => {
    let ind = products.findIndex((pro) => pro.prodName === prod);
    let leadTime = products[ind].leadTime;

    let available = false;
    let today = DateTime.now().setZone("America/Los_Angeles");
    let ddate = DateTime.fromISO(delivDate).setZone("America/Los_Angeles");
    const diff = Math.ceil(Interval.fromDateTimes(today, ddate).length("days"));

    if (Number(diff) > Number(leadTime) - 1) {
      available = true;
    }

    return available;
  };

  const innards1 = (
    <React.Fragment>
      <div key={uuidv4()}>{order["prodName"]}</div>
      <InputBox>
        <input
          type="text"
          size="3"
          maxLength="4"
          key={uuidv4() + "c"}
          disabled={
            (deadlinePassed && authType !== "bpbadmin") ||
            (checkAvailability["prodName"] && authType !== "bpbadmin")
              ? true
              : false
          }
          id={order["prodName"] + "item"}
          name={order["prodName"]}
          data-qty={order["qty"]}
          placeholder={order["qty"]}
          onKeyUp={(e) => {
            handleQtyModify(order["prodName"], e);
          }}
          onBlur={(e) => {
            handleBlur(order["prodName"], e.target);
          }}
        ></input>
      </InputBox>
    </React.Fragment>
  );

  const innards2 = (
    <React.Fragment>
      <Title key={uuidv4()}>{order["prodName"]}</Title>
      <InputNumber
        value={order["qty"]}
        disabled={
          (deadlinePassed && authType !== "bpbadmin") ||
          (checkAvailability["prodName"] && authType !== "bpbadmin")
            ? true
            : false
        }
        inputId={order["prodName"] + "item"}
        size="2"
        style={{ height: "5em" }}
        onValueChange={(e) => {
          handleBlur(order["prodName"], e);
        }}
      />
    </React.Fragment>
  );

  return (
    <React.Fragment>{width > breakpoint ? innards1 : innards2}</React.Fragment>
  );
};

export default Product;
