import React,{ useContext } from 'react';

import swal from '@sweetalert/with-react';

import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { HoldingContext } from '../../../dataContexts/HoldingContext';

import { Button } from 'primereact/button';

import { createOrderUpdatesClip, createStandHoldClip } from '../../../helpers/sortDataHelpers'

import styled from 'styled-components'
import RecentOrderList from './RecentOrderList';

const RecentButton = styled.div`
  display: flex;
  margin: 20px 0;
  
  `


require('dotenv').config()


const RecentOrderListButtons = () => {

  const { orders, originalOrders, recentOrders, setRecentOrders, setOrdersLoaded } = useContext(OrdersContext)
  const { standing, originalStanding, setStandLoaded } = useContext(StandingContext)
  const { holding, originalHolding, setHoldLoaded } = useContext(HoldingContext)

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
      .then(response => response.status===200 ? setOrdersLoaded(false): '') 

    fetch(process.env.REACT_APP_API_SENDSTANDING, uploadStanding)
      .then(response => response.status===200 ? setStandLoaded(false): '')

    fetch(process.env.REACT_APP_API_SENDHOLDING, uploadHolding)
      .then(response => response.status===200 ? setHoldLoaded(false): '')


    
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
        <RecentButton>
          {recentOrders.length>0 ? 
            <Button label="Upload" icon="pi pi-upload" 
            className="p-button-raised p-button-rounded p-button-danger" onClick={handleUpload}/> :
            <Button label="Upload" icon="pi pi-upload" 
            disabled className="p-button-raised p-button-rounded p-button-success" onClick={handleUpload}/>}
       
        </RecentButton>
    </React.Fragment>  
  );
}

export default RecentOrderListButtons;