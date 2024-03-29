import React, { useContext, useState, useEffect } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";

const Quantity = ({ authType }) => {
  const { chosen } = useContext(CurrentDataContext);
  const { deadlinePassed } = useContext(ToggleContext)

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  

  const innards1 = (
    <React.Fragment>
      <InputText
        id="addedProdQty"
        size="10"
        disabled={chosen === "  " || (deadlinePassed && authType !== "bpbadmin") ? true : false}
      />
      <label htmlFor="qty">Quantity</label>
    </React.Fragment>
  );

  const innards2 = (
    <React.Fragment>
      <InputNumber
      
        inputId="addedProdQty"
        size="4"
        disabled={chosen === "  " || (deadlinePassed && authType !== "bpbadmin") ? true : false}
        style={{ height: "3em" }}
      />
      <label htmlFor="qty">Qty</label>
    </React.Fragment>
  );

  return (
    <span className="p-float-label">
      {width > breakpoint ? innards1 : innards2}
    </span>
  );
};

export default Quantity;
