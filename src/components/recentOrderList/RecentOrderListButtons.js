import React,{ useContext } from 'react';

import swal from '@sweetalert/with-react';

import { OrdersContext } from '../../dataContexts/OrdersContext';

import { cloneDeep } from 'lodash';
require('dotenv').config()


const RecentOrderListButtons = () => {

  const { orders, setOrders, setRecentOrders } = useContext(OrdersContext)

  const handleUpload = () => {
    //turn orders into json object - data
    let orderData = cloneDeep(orders)
    orderData = orderData.map(order => [order[5],order[1],order[2],order[3],order[4],order[5],order[6],order[7]])
    setOrders(orderData)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type':'application/json'},
      body: JSON.stringify(orderData)
    };

    fetch(process.env.REACT_APP_API_SENDORDERS, requestOptions)
      .then(response => response.json())
      .then(data => console.log(data))

    setRecentOrders([])
    swal ({
      text: "Recent Orders are now live!",
      icon: "success",
      buttons: false,
      timer: 2000
    })

  }

  return (
      <React.Fragment>      
        <div>
        <button className = "recentOrderListButton" onClick={handleUpload}>Upload</button>
        </div>
    </React.Fragment>  
  );
}

export default RecentOrderListButtons;