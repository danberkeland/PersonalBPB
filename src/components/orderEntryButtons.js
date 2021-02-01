import React, { useContext } from 'react';

import swal from '@sweetalert/with-react';

import { CurrentDataContext } from '../dataContexts/CurrentDataContext';
import { OrdersContext } from '../dataContexts/OrdersContext';

import { convertDatetoBPBDate } from '../helpers/dateTimeHelpers'


function OrderEntryButtons() {

  const { orderTypeWhole, setorderTypeWhole } = useContext(CurrentDataContext)
  const { setChosen, delivDate, chosen, ponote, route } = useContext(CurrentDataContext)
  const { orders, setOrders, thisOrder, setThisOrder, recentOrders, setRecentOrders } = useContext(OrdersContext)

  let type = orderTypeWhole ? "Special" : "Whole";

  const handleChangeorderTypeWhole = () => {
    setorderTypeWhole(!orderTypeWhole)
    setChosen('')
  }

  const handleClear = () => {
    let newThisOrder = [...thisOrder]
    newThisOrder = newThisOrder.map(order => ["0",order[1],order[2],order[3],order[4],"0", orderTypeWhole]) // [ qty, prod, cust, po, route, so ] 
    setThisOrder(newThisOrder);
  }

  const handleAddUpdate = async () => {

    let getOrdersArray = [...orders]
    let filteredOrders = getOrdersArray.filter(order => order[8]+order[0] !== chosen+convertDatetoBPBDate(delivDate))
    let updateThisOrder = await thisOrder.map(order => [order[0],order[2],chosen,ponote,route,order[0],orderTypeWhole])
    setThisOrder(updateThisOrder)
    let convertedThisOrder = thisOrder.map(order => [convertDatetoBPBDate(delivDate),'na,',order[0],'custNum','na',order[3],route,order[1],chosen])
    for (let ord of convertedThisOrder){
     filteredOrders.push(ord)
    }
    setOrders(filteredOrders)

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
      <button onClick={handleChangeorderTypeWhole}>{type} Order</button>
    </div>    
  );
}

export default OrderEntryButtons;
