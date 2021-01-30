import React, { useContext } from 'react';

import swal from '@sweetalert/with-react';

import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';
import { OrdersContext } from '../dataContexts/OrdersContext';


function OrderEntryButtons() {

  const { orderType, setOrderType } = useContext(CustDateRecentContext)
  const { setChosen, delivDate, chosen } = useContext(CustDateRecentContext)
  const { thisOrder, setThisOrder, recentOrders, setRecentOrders } = useContext(OrdersContext)

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

  const handleAddUpdate = () => {
    let newRecentOrder = [delivDate,chosen]
    let stringRecentOrder = JSON.stringify(newRecentOrder)
    const currentRecentOrders = [...recentOrders]
    let stringCurrentRecentOrders = JSON.stringify(currentRecentOrders)

    if (stringCurrentRecentOrders.indexOf(stringRecentOrder) !== -1){
      swal ({
        text: "Order Updated",
        icon: "success",
        buttons: false,
        timer: 2000
      })
      } else {
        currentRecentOrders.push(newRecentOrder)
      }
    setRecentOrders(currentRecentOrders)
  }

  return (         
    <div className = "orderEntryButtons">
      <button onClick={handleAddUpdate}>Add/Update</button>
      <button onClick={handleClear}>Clear Order</button>
      <button>Standing</button>
      <button onClick={handleChangeOrderType}>{type} Order</button>
    </div>    
  );
}

export default OrderEntryButtons;
