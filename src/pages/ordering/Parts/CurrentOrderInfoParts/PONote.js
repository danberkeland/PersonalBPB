import React, { useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";

import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";

const PONote = ({ database }) => {
  const [products, customers, routes, standing, orders] = database;

  const { setModifications } = useContext(ToggleContext);

  const { chosen, route, setRoute, ponote, setPonote, delivDate } =
    useContext(CurrentDataContext);

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
        setPonote(checkOrder.PONote); //Double check this attribute for spelling
      }
    }
  }, [chosen, delivDate, database]);

  const handleSetPonote = (e) => {
    setPonote(e);
    setModifications(true);
  };

  return (
    <React.Fragment>
      <span className="p-float-label">
        <InputText
          id="in"
          size="50"
          value={ponote}
          onChange={(e) => handleSetPonote(e.target.value)}
        />
        <label htmlFor="in">
          {ponote === "" ? "PO#/Special Instructions..." : ""}
        </label>
      </span>
    </React.Fragment>
  );
};

export default PONote;
