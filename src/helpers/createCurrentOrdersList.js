import { useContext } from 'react';

import { OrdersContext } from '../dataContexts/OrdersContext';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { StandingContext } from '../dataContexts/StandingContext';

import { convertDatetoBPBDate, convertDatetoStandingDate } from '../helpers/dateTimeHelpers';



export const CreateCartList = (orders, BPBDate, chosen) => {
  let cartList = orders ? orders.filter(order => order[0] === BPBDate && order[8] === chosen)
                                .map(order => [order[2],order[7],order[8]]) : [];
  return cartList;
}

export const CreateStandingList = (standing, standingDate, chosen) => {
  let standingList = standing ? standing.filter(standing => standing[0] === standingDate && standing[8] === chosen)
                                .map(order => [order[2],order[7],order[8]]) : [];
  return standingList;
}

export const CreateOrderList = (cartList, standingList) => {
  let orderList;
  if (cartList.length>0){
    orderList = cartList;
  } else if (standingList.length>0){
    orderList = standingList;
  } else {
    orderList = []
  }
  return orderList
}


export const CreateCurrentOrdersList = () => {

    const { orders, orderDate } = useContext(OrdersContext);
    const { chosen } = useContext(CustomerContext);
    const { standing } = useContext(StandingContext)
   
    let BPBDate = convertDatetoBPBDate(orderDate)
    let standingDate = convertDatetoStandingDate(orderDate);

    let cartList = CreateCartList(orders, BPBDate, chosen);
    let standingList = CreateStandingList(standing, standingDate, chosen);

    let orderList = CreateOrderList (cartList, standingList);

    return orderList
    
}