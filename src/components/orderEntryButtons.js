import React, { useContext } from 'react';

import swal from '@sweetalert/with-react';

import { CurrentDataContext } from '../dataContexts/CurrentDataContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { StandingContext } from '../dataContexts/StandingContext';

import { convertDatetoBPBDate, convertDatetoStandingDate } from '../helpers/dateTimeHelpers';

const clonedeep = require('lodash.clonedeep')

function OrderEntryButtons() {

  const { orderTypeWhole, setorderTypeWhole, route, ponote } = useContext(CurrentDataContext)
  const { setChosen, delivDate, chosen } = useContext(CurrentDataContext)
  const { orders, setOrders, recentOrders, setRecentOrders } = useContext(OrdersContext)
  const { standing } = useContext(StandingContext)

  let type = orderTypeWhole ? "Special" : "Whole";



  const handleChangeorderTypeWhole = () => {
    setorderTypeWhole(!orderTypeWhole)
    setChosen('')
  }

  /*
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
  */

  
  const handleAddUpdate =  () => {

    // BUILD PRESENT LIST
    // Build Orders List based on delivDate and Chosen
    let BPBDate = convertDatetoBPBDate(delivDate)
    let filteredOrders = clonedeep(orders)
    let cartList = filteredOrders ? filteredOrders.filter(order => order[7] === BPBDate && order[2] === chosen) : [];
    
    // Build Standing List based on delivDate and Chosen
    let standingDate = convertDatetoStandingDate(delivDate);  
    let filteredStanding = clonedeep(standing)
    let standingList = filteredStanding ? filteredStanding.filter(standing => standing[0] === standingDate && standing[8] === chosen) : [];
    let convertedOrderList = standingList.map(order => [    order[2],
                                                            order[7],
                                                            order[8],
                                                            'na',
                                                            order[6],
                                                            order[2], 
                                                            order[3] !== "9999" ? true : false,
                                                            standingDate])
    
    // Compare Order List to Stand List and give Order List precedence in final list                                                        
    let orderList = cartList.concat(convertedOrderList)
    for (let i=0; i<orderList.length; ++i ){
        for (let j=i+1; j<orderList.length; ++j){
            if (orderList[i][1] === orderList[j][1]){
                orderList.splice(j,1);
            }
        }
    }
    // set route if route has changed
    if (orderList.length>0) {
      if (orderList[0][4]!==route){
        orderList.map(item => item[4] = route)
      }
      if (orderList[0][3]!==ponote){
        orderList.map(item => item[3] = ponote)
      } 
    }    
    // Set SO to equal QTY 
    orderList.map(item => item[5] = item[0])
    // Add present List to Orders
    let recent = clonedeep(orders)
    let newOrderList = orderList.concat(recent)
        for (let i=0; i<newOrderList.length; ++i ){
            for (let j=i+1; j<newOrderList.length; ++j){
                if (  newOrderList[i][1] === newOrderList[j][1] &&
                      newOrderList[i][2] === newOrderList[j][2] &&
                      newOrderList[i][7] === newOrderList[j][7]){
                    newOrderList.splice(j,1);
                }
            }
          }
  
    if (newOrderList){
      console.log(newOrderList)
      setOrders(newOrderList)
    }


    // Create item (date, name, whole) to add to recent list
    let newRecentOrder = [delivDate,chosen,orderTypeWhole]
    let stringRecentOrder = JSON.stringify(newRecentOrder)
    const currentRecentOrders = [...recentOrders]
    let stringCurrentRecentOrders = JSON.stringify(currentRecentOrders)

    // If item already exists, send update message
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
      <button 
        onClick={handleAddUpdate}
        >Add/Update</button>
      <button 
        //onClick={handleClear}
        >Clear Order</button>
      <button>Standing</button>
      <button onClick={handleChangeorderTypeWhole}>{type} Order</button>
    </div>    
  );


}




export default OrderEntryButtons;
