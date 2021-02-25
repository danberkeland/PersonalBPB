import React, { useContext, useEffect, useState } from 'react';

import { ToggleContext } from '../../../dataContexts/ToggleContext';

import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';

import styled from 'styled-components'
import { CustomerContext } from '../../../dataContexts/CustomerContext';
import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';

const CurrentOrderInfo = () => {

  const CurrentOrderInfo = styled.div`
    width: 100%;
    display: grid;
    margin: 10px 0;
    grid-template-columns: 1fr;
    column-gap: 10px;
    row-gap: 10px; 
    background-color: lightgrey;
    `

  const SpecialInfo = styled.div`
    width: 100%;
    display: flex;
    margin: 0px 10px 10px 10px;
    `

  const TitleBox = styled.div`
    display: flex;
    width: 90%;
    justify-content: space-between;
    align-items: center;
    `
  const Title = styled.h2`
    padding: 0;
    margin: 10px 0;
    `
  const DateStyle = styled.h4`
    padding: 0;
    color: grey;
    margin: 10px 0;
    `
  const FulfillOptions = styled.div`
    display: grid;
    grid-template-columns: 3fr 3fr 1fr 3fr 1fr 3fr 1fr;
    margin: 10px;
    align-items: center;
    justify-items: center;
    `
    
  const {cartList, standList, orderTypeWhole } = useContext(ToggleContext)
  const { customers } = useContext(CustomerContext)
  const { chosen, setChosen, delivDate } = useContext(CurrentDataContext)
  const { orders } = useContext(OrdersContext)
  const { standing } = useContext(StandingContext)

  const [ customerGroup, setCustomerGroup ] = useState(customers)
  const [ delivStatus, setDelivStatus ] = useState('slopick')


  const ho = {
  color: "red"
  }

  const so = {
    color: "rgb(66, 97, 201)"
  }

  let orderType
  cartList ? orderType = "Cart" : standList ? orderType = "Standing" : orderType = "Holding"

  

    useEffect(() => {
      setCustomerGroup(customers)
    },[ customers ])


    // Figure out if current order is delivery or pickup
    useEffect(() => {
      let custRoute
      let currentOrderList = buildCurrentOrder(chosen,delivDate,orders,standing)
      if (currentOrderList.length>0){
        custRoute = currentOrderList[0]["route"]
      } else {
        custRoute = customers.filter(cust => cust["name"]===chosen)[0]["route"]
      }

      switch(custRoute){
        case "Pick up SLO":
          setDelivStatus('slopick');
          break;
        case "Pick up Carlton":
          setDelivStatus('atownpick');
          break;
        default:
          setDelivStatus('deliv');
          break;
      }    
    }, [chosen, delivDate, customers, orders, standing])
   


    const changeDate = (date) => {
      let currentDate = new Date(date);
      var fd = currentDate.toDateString();
      return fd;
    }

  return (   
    <React.Fragment>
      {orderTypeWhole ?
      <React.Fragment> 
        <TitleBox>
          <Title style={cartList ? so : standList ? so : ho }>Wholesale {orderType} Order</Title>
          <DateStyle>{delivDate ? changeDate(delivDate) : ''}</DateStyle>
        </TitleBox>
      </React.Fragment> : <h2 style={standList ? so : ho }>Retail {orderType} Order</h2>}

      
        <CurrentOrderInfo>
         
          <FulfillOptions> 
            <Dropdown id="customers" 
              value={chosen} options={customerGroup} 
              optionLabel="name" placeholder="Select a customer"
              onChange={(e) => setChosen(e.value)}/>     
            <label htmlFor="delivery">Delivery</label>
            <RadioButton value="deliv" name="delivery" 
              onChange={(e) => setDelivStatus(e.value)} checked={delivStatus === 'deliv'}/>
            <label htmlFor="pickupSLO">Pick up SLO</label>
            <RadioButton value="slopick" name="delivery"
              onChange={(e) => setDelivStatus(e.value)} checked={delivStatus === 'slopick'} />
            <label htmlFor="pickupAtown">Pick up Carlton</label>
            <RadioButton value="atownpick" name="delivery" 
              onChange={(e) => setDelivStatus(e.value)} checked={delivStatus === 'atownpick'}/>
          </FulfillOptions>
          <SpecialInfo>
            <span className="p-float-label">
              <InputText id="in" size="50"/>
              <label htmlhtmlFor="in">PO#/Special Instructions ...</label>
            </span>
          </SpecialInfo>
        </CurrentOrderInfo>
    </React.Fragment>
      
  );
}

export default CurrentOrderInfo;
