import React, { useContext } from 'react';

import swal from '@sweetalert/with-react';

import { CurrentDataContext } from '../dataContexts/CurrentDataContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { StandingContext } from '../dataContexts/StandingContext';

import { createCartList, createStandingList,createCurrentOrderList } from '../helpers/sortDataHelpers'
import { convertDatetoBPBDate } from '../helpers/dateTimeHelpers';


function OrderEntryButtons() {

  const { orderTypeWhole, setorderTypeWhole } = useContext(CurrentDataContext)
  const { setChosen, delivDate, chosen } = useContext(CurrentDataContext)
  const { orders, setOrders, recentOrders, setRecentOrders } = useContext(OrdersContext)
  const { standing } = useContext(StandingContext)

  let type = orderTypeWhole ? "Special" : "Whole";


  const buildOrderList = () => {
    let cartList = createCartList(chosen, delivDate, orders)
    let standingList = createStandingList(chosen, delivDate, standing)
    let orderList = createCurrentOrderList(cartList,standingList)
    return orderList
  }

  const handleChangeorderTypeWhole = () => {
    setorderTypeWhole(!orderTypeWhole)
    setChosen('')
  }

  const handleClear = () => {
    let orderList = buildOrderList()
    orderList = orderList.map(order => ["0",order[1],order[2],order[3],order[4],order[0], orderTypeWhole,convertDatetoBPBDate(delivDate)]) 
    let currentOrderList = orderList.concat(orders)
    for (let i=0; i<currentOrderList.length; ++i ){
        for (let j=i+1; j<currentOrderList.length; ++j){
            if (currentOrderList[i][1] === currentOrderList[j][1] &&
              currentOrderList[i][2] === currentOrderList[j][2] &&
              currentOrderList[i][7] === currentOrderList[j][7]){
                currentOrderList.splice(j,1);
            }
        }
    }
    setOrders(currentOrderList);
  }

  const handleAddUpdate =  () => {
    let orderList = buildOrderList()
    console.log(orderList)
    orderList.map(order => order[5] = order[0])
    let currentOrderList = orderList.concat(orders)
    for (let i=0; i<currentOrderList.length; ++i ){
        for (let j=i+1; j<currentOrderList.length; ++j){
            if (currentOrderList[i][1] === currentOrderList[j][1] &&
              currentOrderList[i][2] === currentOrderList[j][2] &&
              currentOrderList[i][7] === currentOrderList[j][7]){
                currentOrderList.splice(j,1);
            }
        }
    }
    setOrders(currentOrderList)

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
