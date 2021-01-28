import React, { useContext } from 'react';
import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';


function OrderEntryButtons() {

  const { orderType, setOrderType } = useContext(CustDateRecentContext)
  const { setChosen } = useContext(CustDateRecentContext)

  let type = orderType ? "Special" : "Whole";

  const handleClick = () => {
    setOrderType(!orderType)
    setChosen('')
  }

  return (         
    <div className = "orderEntryButtons">
      <button>Add/Update</button>
      <button>Clear Order</button>
      <button>Standing</button>
      <button onClick={handleClick}>{type} Order</button>
    </div>    
  );
}

export default OrderEntryButtons;
