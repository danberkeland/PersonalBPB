import React from 'react';

import { CustomerLoad, CustomerProvider } from './dataContexts/CustomerContext'
import { OrdersLoad, OrdersProvider } from './dataContexts/OrdersContext'
import { ProductsLoad, ProductsProvider } from './dataContexts/ProductsContext'
import { StandingLoad, StandingProvider } from './dataContexts/StandingContext'
import { HoldingLoad, HoldingProvider } from './dataContexts/HoldingContext'
import { CurrentDataProvider } from './dataContexts/CurrentDataContext'

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
            <HoldingProvider>
              <CurrentDataProvider>

                <StandingLoad />
                <ProductsLoad />
                <CustomerLoad />
                <OrdersLoad />
                <HoldingLoad />
                <div className = "mainContainer">
                  <div className = "calendarContainer">
                    <CalendarApp />
                  </div>
                  <div className = "centralContainer">
                    <OrderCommandLine /> 
                    <CurrentOrderInfo />  
                    <CurrentOrderList />    
                    <OrderEntryButtons />
                  </div> 
                  <div className = "rightContainer">
                    <RecentOrderList />
                  </div>   
                </div>
              </CurrentDataProvider>
            </HoldingProvider>
          </StandingProvider>
        </ProductsProvider>
      </OrdersProvider>
    </CustomerProvider>
           
  );
}

export default App;
