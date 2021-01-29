import React, { useContext } from 'react';
import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';
import { OrdersContext } from '../dataContexts/OrdersContext';


function OrderEntryButtons() {

  const { orderType, setOrderType } = useContext(CustDateRecentContext)
  const { setChosen } = useContext(CustDateRecentContext)
  const { thisOrder, setThisOrder } = useContext(OrdersContext)

  let type = orderType ? "Special" : "Whole";

  const handleChangeOrderType = () => {
    setOrderType(!orderType)
    setChosen('')
  }

  const handleClear = () => {
    let newThisOrder = [...thisOrder]
    newThisOrder = newThisOrder.map(order => ["0",order[1],order[2],order[3],order[4]])
    setThisOrder(newThisOrder);

  }

  return (         
    <div className = "orderEntryButtons">
      <button>Add/Update</button>
      <button onClick={handleClear}>Clear Order</button>
      <button>Standing</button>
      <button onClick={handleChangeOrderType}>{type} Order</button>
    </div>    
  );
}

export default OrderEntryButtons;
