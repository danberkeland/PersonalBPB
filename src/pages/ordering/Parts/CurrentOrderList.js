import React, { useContext } from "react";

import CartEntryItem from "../e_CurrentOrderList/CartOrder/CartEntryItem";
import AddCartEntryItem from "../e_CurrentOrderList/CartOrder/AddCartEntryItem";
import StandingOrderEntry from "../e_CurrentOrderList/StandingOrder/StandingOrderEntry";
import AddStandingOrderEntry from "../e_CurrentOrderList/StandingOrder/AddStandingOrderEntry";

import { ToggleContext } from "../../../dataContexts/ToggleContext";
import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";

const CurrentOrderList = ({ authType }) => {
  const { cartList } = useContext(ToggleContext);
  const { database, setDatabase } = useContext(CurrentDataContext)

  return (
    <React.Fragment>
      {cartList ? (
        <React.Fragment>
          <div className="currentOrderList">
            <CartEntryItem database={database} setDatabase={setDatabase} authType={authType}/>
          </div>
          <AddCartEntryItem database={database} setDatabase={setDatabase} authType={authType}/>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="currentStandingList">
            <StandingOrderEntry database={database} setDatabase={setDatabase}/>
          </div>
          <AddStandingOrderEntry database={database} setDatabase={setDatabase} authType={authType}/>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CurrentOrderList;
