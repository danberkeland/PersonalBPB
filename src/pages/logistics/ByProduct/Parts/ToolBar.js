import React, { useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";

import { Calendar } from "primereact/calendar";

import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../../helpers/dateTimeHelpers";

const { DateTime } = require("luxon");

const ToolBar = () => {
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);
  const { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    let [today] = todayPlus();
    setDelivDate(today);
  }, []);

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
    setIsLoading(true);
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