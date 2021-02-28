import React, { useContext } from 'react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';

import { convertDatetoBPBDate } from '../../../helpers/dateTimeHelpers';
import { buildCurrentOrder } from '../../../helpers/CartBuildingHelpers'

import { Button } from 'primereact/button';

import swal from '@sweetalert/with-react';

import styled from 'styled-components'

const OrderButtons = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 5px 0;
    `




const clonedeep = require('lodash.clonedeep')

function OrderEntryButtons() {

  

  const { route, ponote } = useContext(CurrentDataContext)
  const { setChosen, delivDate, chosen, currentCartList } = useContext(CurrentDataContext)
  const { orders, setOrders, recentOrders, setRecentOrders } = useContext(OrdersContext)
  const { standing } = useContext(StandingContext)
  const { orderTypeWhole, setOrderTypeWhole,modifications, setModifications, 
          cartList, setCartList, standList, setRouteIsOn } = useContext(ToggleContext)

  let type = orderTypeWhole ? "Special" : "Whole";
  let cartStand = cartList ? "Standing" : "Cart"



  const handleChangeorderTypeWhole = () => {
    document.getElementById('orderCommand').focus()
    setOrderTypeWhole(!orderTypeWhole)
    setChosen('')
  }

  const handleCartStandToggle = () => {
    document.getElementById('orderCommand').focus()
    let realCartList = clonedeep(cartList)
    realCartList ? setRouteIsOn(false) : setRouteIsOn(true)
    setCartList(!cartList)
  }
  
  const handleClear = () => {

    let orderList = clonedeep(currentCartList)  
    console.log(orderList)
    orderList = orderList.map(order => ({
      "qty": "0",
      "prodName": order["prodName"],
      "custName": order["custName"],
      "PONote": order["PONote"],
      "route": order["route"],
      "SO": order["SO"], 
      "isWhole": orderTypeWhole,
      "delivDate":convertDatetoBPBDate(delivDate)}
      ))

    let currentOrderList = orderList.concat(orders)

    for (let i=0; i<currentOrderList.length; ++i ){
        for (let j=i+1; j<currentOrderList.length; ++j){
            if (currentOrderList[i]["prodName"] === currentOrderList[j]["prodName"] &&
              currentOrderList[i]["custName"] === currentOrderList[j]["custName"] &&
              currentOrderList[i]["delivDate"] === currentOrderList[j]["delivDate"]){
                currentOrderList.splice(j,1);
            }
        }
    }
    setOrders(currentOrderList);
  }


  
  const handleAddUpdate =  () => {

    let orderList = buildCurrentOrder(chosen,delivDate,orders,standing)
    setModifications(false)
    // set route if route has changed
    if (orderList.length>0) {
      if (orderList[0]["route"]!==route){
        orderList.map(item => item["route"] = route)
      }
      if (orderList[0]["PONote"]!==ponote){
        orderList.map(item => item["PONote"] = ponote)
      } 
    }    
    // Set SO to equal QTY 
    orderList.map(item => item["SO"] = item["qty"])
    // Add present List to Orders
    let recent = clonedeep(orders)
    let newOrderList = orderList.concat(recent)
        for (let i=0; i<newOrderList.length; ++i ){
            for (let j=i+1; j<newOrderList.length; ++j){
                if (  newOrderList[i]["prodName"] === newOrderList[j]["prodName"] &&
                      newOrderList[i]["custName"] === newOrderList[j]["custName"] &&
                      newOrderList[i]["delivDate"] === newOrderList[j]["delivDate"]){
                    newOrderList.splice(j,1);
                }
            }
          }
  
    if (newOrderList){
      document.getElementById('orderCommand').focus()
      setOrders(newOrderList)
    }


    // Create item (date, name, whole) to add to recent list
    let newRecentOrder = [delivDate,chosen.name,orderTypeWhole,cartList,standList]
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
        swal ({
          text: "Order Updated",
          icon: "success",
          buttons: false,
          timer: 2000
        })
      }
    setRecentOrders(currentRecentOrders)
  }
  

  return (         
    <OrderButtons>
      <Button label="Add/Update" icon="pi pi-plus" disabled={chosen==='  '} onClick={handleAddUpdate}
        className={modifications ? "p-button-raised p-button-rounded p-button-danger" : "p-button-raised p-button-rounded p-button-success"} />
      <Button label="Clear" icon="pi pi-trash" disabled={!cartList} onClick={handleClear}
        className="p-button-raised p-button-rounded p-button-info" />
      <Button label={cartStand} icon="pi pi-shopping-cart" onClick={handleCartStandToggle} 
        className="p-button-raised p-button-rounded p-button-secondary" />
      <Button label={type} icon="pi pi-dollar" onClick={handleChangeorderTypeWhole}
        className="p-button-raised p-button-rounded p-button-secondary" />
      
    </OrderButtons>    
  );


}




export default OrderEntryButtons;
