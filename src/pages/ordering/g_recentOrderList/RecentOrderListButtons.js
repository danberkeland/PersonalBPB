import React,{ useContext } from 'react';

import swal from '@sweetalert/with-react';

import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { HoldingContext } from '../../../dataContexts/HoldingContext';

import { createOrderUpdatesClip, createStandHoldClip } from '../../../helpers/sortDataHelpers'


require('dotenv').config()


const RecentOrderListButtons = () => {

  const { orders, originalOrders, setRecentOrders } = useContext(OrdersContext)
  const { standing, originalStanding } = useContext(StandingContext)
  const { holding, originalHolding } = useContext(HoldingContext)

  const handleUpload = () => {
    let orderData = createOrderUpdatesClip(orders, originalOrders)
    let standingData = createStandHoldClip(standing, originalStanding)
    let holdingData = createStandHoldClip(holding, originalHolding)
    // need to trigger reload of orders from API

    const uploadOrders = {
      method: 'POST',
      headers: { 'Content-Type':'application/json'},
      body: JSON.stringify(orderData)
    };

    const uploadStanding = {
      method: 'POST',
      headers: { 'Content-Type':'application/json'},
      body: JSON.stringify(standingData)
    };

    const uploadHolding = {
      method: 'POST',
      headers: { 'Content-Type':'application/json'},
      body: JSON.stringify(holdingData)
    };


    fetch(process.env.REACT_APP_API_SENDORDERS, uploadOrders)
      .then(response => response.json())
      .then(data => console.log(data))

    fetch(process.env.REACT_APP_API_SENDSTANDING, uploadStanding)
      .then(response => response.json())
      .then(data => console.log(data))

    fetch(process.env.REACT_APP_API_SENDHOLDING, uploadHolding)
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