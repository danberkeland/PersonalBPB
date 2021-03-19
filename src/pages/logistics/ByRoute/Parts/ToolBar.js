import React, { useContext } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";

import { Calendar } from "primereact/calendar";

const { DateTime } = require("luxon");

const ToolBar = () => {
  const { setDelivDate, route } = useContext(CurrentDataContext);
  

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
          disabled ={route ? false : true}
          dateFormat="mm/dd/yy"
          onChange={(e) => setDate(e.value)}
        />
      </div>
    </React.Fragment>
  );
};

export default ToolBar;
