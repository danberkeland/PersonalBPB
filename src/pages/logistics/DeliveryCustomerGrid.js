import React, { useContext } from 'react';

import styled from 'styled-components'


import Calendar from '../ordering/Parts/Calendar'
import ByCustomer from './ByCustomer.js'
import Routes from '../../reusableComponents/routes';

import { CustomerContext, CustomerLoad } from '../../dataContexts/CustomerContext'
import { OrdersContext, OrdersLoad } from '../../dataContexts/OrdersContext'
import { ProductsContext, ProductsLoad } from '../../dataContexts/ProductsContext'
import { StandingContext, StandingLoad } from '../../dataContexts/StandingContext'
import LogisticsFunctions from './LogisticsFunctions';

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';




function Logistics() {

  const delivDate = "01/02/2021"

  const cities = [
    {name: 'New York', code: 'NY'},
    {name: 'Rome', code: 'RM'},
    {name: 'London', code: 'LDN'},
    {name: 'Istanbul', code: 'IST'},
    {name: 'Paris', code: 'PRS'}
  ];

  const LogisticsContainer = styled.div`
    font-family: 'Montserrat', sans-serif;
    margin: auto;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 2fr; 
    `

  const InfoContainer = styled.div`
    border: 1px solid lightgray;
    margin: 10px 20px;
    padding: 10px 10px;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    `
  const BasicContainer = styled.div`
    border: 1px solid lightgray;
    margin: 10px 20px;
    padding: 10px 10px;
    `

  const { standLoaded } = useContext(StandingContext)
  const { prodLoaded } = useContext(ProductsContext)
  const { custLoaded } = useContext(CustomerContext)
  const { ordersLoaded } = useContext(OrdersContext)

  return (
      <LogisticsContainer>
       
        {!standLoaded ? <StandingLoad /> : ''}
        {!prodLoaded ? <ProductsLoad /> : ''}
        {!custLoaded ? <CustomerLoad /> : ''}
        {!ordersLoaded ? <OrdersLoad /> : ''}
        <BasicContainer>
          <Calendar />
        </BasicContainer>
        
          <div id="orderCommand">
            <InfoContainer>
              <label htmlFor="delivDate" className="p-d-block">Delivery Date</label>
              <InputText id="delivDate" value={delivDate} />
              <Dropdown options={cities} optionLabel="name" placeholder="Select a route"/>
              <Button label="Print" icon="pi pi-print" className="p-button-raised p-button-rounded p-button-success" />
              <Button label="Refresh" icon="pi pi-refresh" className="p-button-raised p-button-rounded p-button-info" />
            </InfoContainer>
            <BasicContainer><ByCustomer /> </BasicContainer>
          </div> 
         


          </LogisticsContainer>
        

      
        
      
            
  );
}

export default Logistics;
