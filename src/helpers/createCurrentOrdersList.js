import React, { useContext } from 'react';

import { OrdersContext } from '../dataContexts/OrdersContext';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { StandingContext } from '../dataContexts/StandingContext';

import { convertDatetoBPBDate, convertDatetoStandingDate } from '../helpers/dateTimeHelpers';

export const CreateCurrentOrdersList = () => {

    const [orders, setOrder, orderDate, setOrderDate] = useContext(OrdersContext);
    const [customers, setCustomer, chosen, setChosen] = useContext(CustomerContext);
    const [standing, setStanding] = useContext(StandingContext)
   
    let BPBDate = convertDatetoBPBDate(orderDate)
    let standingDate = convertDatetoStandingDate(orderDate);

    let orderList
    let cartList = orders ? orders.filter(order => order[0] === BPBDate && order[8] === chosen)
      .map(order => [order[2],order[7],order[8]]) : []
    let standingList = standing ? standing.filter(standing => standing[0] === standingDate && standing[8] === chosen)
      .map(order => [order[2],order[7],order[8]]) : []


    if (cartList.length>0){
      orderList = cartList;
    } else if (standingList.length>0){
      orderList = standingList;
    } else {
      orderList = []
    }

    return orderList
    
}