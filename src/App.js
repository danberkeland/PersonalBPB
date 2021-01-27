import React from 'react';

import { CustomerLoad, CustomerProvider } from './dataContexts/CustomerContext'
import { OrdersLoad, OrdersProvider } from './dataContexts/OrdersContext'
import { ProductsLoad, ProductsProvider } from './dataContexts/ProductsContext'
import { StandingLoad, StandingProvider } from './dataContexts/StandingContext'
import { CustDateRecentProvider } from './dataContexts/CustDateRecentContext'

import CalendarApp from './components/calendarApp'
import CurrentOrderInfo from './components/currentOrderInfo'
import CurrentOrderList from './components/currentOrderList'
import OrderCommandLine from './components/orderCommandLine'
import OrderEntryButtons from './components/orderEntryButtons'
import RecentOrderList from './components/recentOrderList';


import './App.css';





function App() {

  return (
    
    <CustomerProvider>
      <OrdersProvider>
        <ProductsProvider>
          <StandingProvider>
            <CustDateRecentProvider>
      
              <StandingLoad />
              <ProductsLoad />
              <CustomerLoad />
              <OrdersLoad />
              <div className = "mainContainer">
                <div className = "calendarContainer">
                  <CalendarApp />
                </div>
                <div className = "centralContainer">
                  <CurrentOrderInfo />   
                  <CurrentOrderList />    
                  <OrderCommandLine />
                  <OrderEntryButtons />
                </div> 
                <div className = "rightContainer">
                  <RecentOrderList />
                </div>   
              </div>
            </CustDateRecentProvider>
          </StandingProvider>
        </ProductsProvider>
      </OrdersProvider>
    </CustomerProvider>
           
  );
}

export default App;
