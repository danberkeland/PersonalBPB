import React, { useContext } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";

import { Calendar } from "primereact/calendar";
import { OrdersContext } from "../../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../../dataContexts/StandingContext";
import { useEffect } from "react/cjs/react.development";
import { buildCartList, buildStandList, compileFullOrderList } from "../../../../helpers/CartBuildingHelpers";

const { DateTime } = require("luxon");


const ToolBar = ({ setOrderList }) => {
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);
  const { orders } = useContext(OrdersContext);
  const { standing } = useContext(StandingContext);

  useEffect(() => {

    let buildOrders = buildCartList('*', delivDate, orders)
    let buildStand = buildStandList('*', delivDate, standing)
    let fullOrder = compileFullOrderList(buildOrders,buildStand)
    setOrderList(fullOrder)
  },[delivDate])

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
          dateFormat="mm/dd/yy"
          onChange={(e) => setDate(e.value)}
        />
      </div>
    </React.Fragment>
  );
};

export default ToolBar;
