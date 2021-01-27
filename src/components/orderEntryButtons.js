import React, { useContext } from 'react';
import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';


function OrderEntryButtons() {

  const { orderType, setOrderType } = useContext(CustDateRecentContext)

  let type = orderType ? "Special" : "Whole";

  const handleClick = () => {
    setOrderType(!orderType)
  }

  return (         
    <div className = "orderEntryButtons">
      <button>Add/Update</button>
      <button>Clear Order</button>
      <button onClick={handleClick}>{type} Order</button>
    </div>    
  );
}

export default OrderEntryButtons;
