import React, { useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";

import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";

const clonedeep = require("lodash.clonedeep");

const PONote = ({ database, setDatabase }) => {
  const [products, customers, routes, standing, orders] = database;

  const { cartList, setModifications } = useContext(ToggleContext);

  const {
    chosen,
    route,
    setRoute,
    ponote,
    setPonote,
    delivDate,
    currentCartList,
  } = useContext(CurrentDataContext);

  const orderCheck = () => {
    let orderCheck = orders.filter(
      (ord) =>
        ord["custName"] === chosen &&
        ord["delivDate"] === convertDatetoBPBDate(delivDate)
    );

    if (orderCheck.length > 0) {
      return orderCheck[0];
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (database.length > 0) {
      setPonote("");
      let checkOrder = orderCheck();
      if (checkOrder) {
        setPonote(checkOrder.PONote);
      }
    }
  }, [chosen, delivDate, database]);

  const updateOrders = (e) => {
    let ordToMod = clonedeep(orders);

    for (let ord of ordToMod) {
      if (
        ord.custName === chosen &&
        ord.delivDate === convertDatetoBPBDate(delivDate)
      ) {
        ord.PONote = e.target.value;
      }

      if (
        ordToMod.filter(
          (ord) =>
            ord.custName === chosen &&
            ord.delivDate === convertDatetoBPBDate(delivDate)
        ).length === 0
      ) {
        for (let curr of currentCartList) {
          curr.PONote = ponote;
          ordToMod.push(curr);
        }
      }
    }
    let DBToMod = clonedeep(database);
    DBToMod[4] = ordToMod;
    setDatabase(DBToMod);
    setModifications(true)
    
    setPonote(e.target.value);
    document.getElementById("inPo").value = "";
  };

  const handleChange = (e) => {
    if (e.code === "Enter") {
      updateOrders(e);
    }
  };

  const handleBlur = (e) => {
    if (e.target.value) {
      updateOrders(e);
    }
  };

  return (
    <React.Fragment>
      <span className="p-float-label">
        <InputText
          id="inPo"
          size="25"
          placeholder={ponote}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => handleBlur(e)}
          disabled={
            currentCartList.length !== 0 || cartList === true ? false : true
          }
        />
        <label htmlFor="in">
          {ponote === "" ? "PO#/Special Instructions..." : ""}
        </label>
      </span>
    </React.Fragment>
  );
};

export default PONote;
