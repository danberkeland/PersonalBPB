import React, { useContext } from 'react';

import swal from '@sweetalert/with-react';

import styled from 'styled-components'

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';

import { convertDatetoBPBDate } from '../../../helpers/dateTimeHelpers';

import { buildCurrentOrder } from '../../../helpers/CartBuildingHelpers'

import { Button } from 'primereact/button';


const clonedeep = require('lodash.clonedeep')

function OrderEntryButtons() {

  const OrderEntryButtons = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 5px 0;
    `


  const { route, ponote } = useContext(CurrentDataContext)
  const { setChosen, delivDate, chosen } = useContext(CurrentDataContext)
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

     // BUILD PRESENT LIST
    // Build Orders List based on delivDate and Chosen
    let orderList = buildCurrentOrder(chosen,delivDate,orders,standing)
    setModifications(true)

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

    let orderList = buildCurrentOrder(chosen,delivDate,orders,standing)
    setModifications(false)
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
      document.getElementById('orderCommand').focus()
      setOrders(newOrderList)
    }


    // Create item (date, name, whole) to add to recent list
    let newRecentOrder = [delivDate,chosen,orderTypeWhole,cartList,standList]
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
  
  const noMods = {
    backgroundColor: "green"
  }
  
  const mods = {
    backgroundColor: "red"
  }

  return (         
    <OrderEntryButtons>
      <Button label="Add/Update" icon="pi pi-plus" className="p-button-raised p-button-rounded p-button-success" />
      <Button label="Clear" icon="pi pi-trash" className="p-button-raised p-button-rounded p-button-info" />
      <Button label="Cart" icon="pi pi-shopping-cart" className="p-button-raised p-button-rounded p-button-secondary" />
      <Button label="Whole" icon="pi pi-dollar" className="p-button-raised p-button-rounded p-button-secondary" />
      
    </OrderEntryButtons>    
  );


}




export default OrderEntryButtons;
