import React,{ useContext } from 'react';

import swal from '@sweetalert/with-react';

import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { HoldingContext } from '../../../dataContexts/HoldingContext';

import { Button } from 'primereact/button';

import { createOrderUpdatesClip, createStandHoldClip } from '../../../helpers/sortDataHelpers'

import styled from 'styled-components'

import { createOrder, createHolding, createStanding } from '../../../graphql/mutations'

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
          console.log('error on creating Orders', error)
        }
      }
    }

    const updateHolding = async () => {
      
      for (let hold of holdingData) {
        let updateDetails = {
          dayNum: hold["dayNum"],
          qty: hold["qty"],
          timeStamp: hold["timeStamp"],
          prodName: hold["prodName"],
          custName: hold["custName"],
          SO: hold["qty"]
        };
 
        try{
          const holdData = await API.graphql(graphqlOperation(createHolding, {input: {...updateDetails}}))
          swal ({
            text: `Holding Orders have been updated.`,
            icon: "success",
            buttons: false,
            timer: 2000
        })
        setHoldLoaded(false)

        } catch (error){
          console.log('error on creating Holding Order', error)
        }
      }
    }

    const updateStanding = async () => {
      
      for (let stand of standingData) {
        let updateDetails = {
          dayNum: stand["dayNum"],
          qty: stand["qty"],
          timeStamp: stand["timeStamp"],
          prodName: stand["prodName"],
          custName: stand["custName"],
          SO: stand["qty"]
        };
      
        try{
          const standData = await API.graphql(graphqlOperation(createStanding, {input: {...updateDetails}}))
          swal ({
            text: `Standing Orders have been updated.`,
            icon: "success",
            buttons: false,
            timer: 2000
        })
        setStandLoaded(false)

        } catch (error){
          console.log('error on creating Holding Order', error)
        }
      }
    }


    updateOrder()
    updateStanding()
    updateHolding() 
    
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