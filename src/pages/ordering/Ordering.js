import React, { useContext } from 'react';

import Calendar from './Parts/Calendar'
import CurrentOrderInfo from './Parts/CurrentOrderInfo'
import CurrentOrderList from './Parts/CurrentOrderList'
import OrderCommandLine from './Parts/OrderCommandLine'
import OrderEntryButtons from './Parts/OrderEntryButtons'
import RecentOrderList from './g_recentOrderList';

import { CustomerContext, CustomerLoad } from '../../dataContexts/CustomerContext'
import { OrdersContext, OrdersLoad } from '../../dataContexts/OrdersContext'
import { ProductsContext, ProductsLoad } from '../../dataContexts/ProductsContext'
import { StandingContext, StandingLoad } from '../../dataContexts/StandingContext'
import { HoldingContext, HoldingLoad } from '../../dataContexts/HoldingContext'

import styled from 'styled-components'

const MainWindow = styled.div`
    font-family: 'Montserrat', sans-serif;
    width: 100%;
    height: 100%;
    margin: auto;
    display: grid;
    grid-template-columns: .8fr 1.4fr .6fr;    
  `

  const BasicContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 95%;
    border: 1px solid lightgray;
    padding: 10px 10px;
    margin: 0px 10px;
    box-sizing: border-box;
    `



function Ordering() {

  const { standLoaded } = useContext(StandingContext)
  const { prodLoaded } = useContext(ProductsContext)
  const { custLoaded } = useContext(CustomerContext)
  const { ordersLoaded } = useContext(OrdersContext)
  const { holdLoaded } = useContext(HoldingContext)

  
  return (
      <MainWindow>     
        {!ordersLoaded ? <OrdersLoad /> : ''}
        {!custLoaded ? <CustomerLoad /> : ''}
        {!prodLoaded ? <ProductsLoad /> : ''}
        {!standLoaded ? <StandingLoad /> : ''}
        {!holdLoaded ? <HoldingLoad /> : ''}
       
        <BasicContainer>
          <Calendar />
        </BasicContainer>
        <BasicContainer>
          <OrderCommandLine />   
          <CurrentOrderInfo />  
          <CurrentOrderList />  
          <OrderEntryButtons />
        </BasicContainer> 
        <BasicContainer>
          <RecentOrderList />
        </BasicContainer>   
      </MainWindow>          
  );
}

export default Ordering;
