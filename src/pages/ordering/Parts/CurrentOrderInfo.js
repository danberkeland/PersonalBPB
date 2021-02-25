import React, { useContext, useEffect, useState } from 'react';

import { ToggleContext } from '../../../dataContexts/ToggleContext';

import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';

import styled from 'styled-components'
import { CustomerContext } from '../../../dataContexts/CustomerContext';

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
    grid-template-columns: 3fr 2fr 1fr 2fr 1fr 2fr 1fr;
    margin: 10px;
    align-items: center;
    justify-items: center;
    `

  const delivDate = "01/02/2021"


  const {cartList, standList, orderTypeWhole } = useContext(ToggleContext)
  const { customers } = useContext(CustomerContext)

  const [ customerGroup, setCustomerGroup ] = useState(customers)


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




  return (   
    <React.Fragment>
      {orderTypeWhole ?
      <React.Fragment> 
        <TitleBox>
          <Title style={cartList ? so : standList ? so : ho }>Wholesale {orderType} Order</Title>
          <DateStyle>Tues, March 12</DateStyle>
        </TitleBox>
      </React.Fragment> : <h2 style={standList ? so : ho }>Retail {orderType} Order</h2>}

      
        <CurrentOrderInfo>
         
          <FulfillOptions> 
            <Dropdown id="customers" options={customerGroup} optionLabel="name" placeholder="Select a customer"/>     
            <label htmlFor="delivery">Delivery</label>
            <RadioButton value="deliv" name="delivery" />
            <label htmlFor="pickupSLO">Pick up SLO</label>
            <RadioButton value="slopick" name="delivery" />
            <label htmlFor="pickupAtown">Pick up Carlton</label>
            <RadioButton value="atownpick" name="delivery" />
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
