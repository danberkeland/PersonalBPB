import React, { useContext } from "react";

import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { Calendar } from "primereact/calendar";

import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";

const { DateTime } = require("luxon");

const ToolBar = ({ delivDate, setDelivDate }) => {
  let { setIsLoading } = useContext(ToggleContext);

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
  };

  return (
    <React.Fragment>
      <div className="p-field p-col-12 p-md-4">
        <label htmlFor="delivDate">Pick Delivery Date: </label>
        <Calendar
          id="delivDate"
          placeholder={convertDatetoBPBDate(delivDate)}
          dateFormat="mm/dd/yy"
          onChange={(e) => setDate(e.value)}
        />
      </div>
    </React.Fragment>
  );
};

export default ToolBar;
