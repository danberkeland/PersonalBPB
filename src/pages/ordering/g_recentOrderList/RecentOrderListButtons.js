import React,{ useContext } from 'react';

import swal from '@sweetalert/with-react';

import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { HoldingContext } from '../../../dataContexts/HoldingContext';

import { Button } from 'primereact/button';

import { createOrderUpdatesClip, createStandHoldClip } from '../../../helpers/sortDataHelpers'

import styled from 'styled-components'
import RecentOrderList from './RecentOrderList';

import { createOrder } from '../../../graphql/mutations'

import { API, graphqlOperation } from 'aws-amplify';


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



    const updateOrder = async () => {
      
      for (let ord of orderData) {
        let updateDetails = {
          qty: ord["qty"],
          prodName: ord["prodName"],
          custName: ord["custName"],
          PONote: ord["PONote"],
          route: ord["route"],
          SO: ord["SO"],
          isWhole: ord["isWhole"],
          delivDate: ord["delivDate"],
          timeStamp: ord["timeStamp"]
        };
        console.log(updateDetails)
        try{
          const ordData = await API.graphql(graphqlOperation(createOrder, {input: {...updateDetails}}))
          swal ({
            text: `Orders have been updated.`,
            icon: "success",
            buttons: false,
            timer: 2000
        })
        setOrdersLoaded(false)

        } catch (error){
          console.log('error on fetching Cust List', error)
        }
      }
    }


    updateOrder() 
    
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