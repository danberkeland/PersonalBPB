import React from 'react';


import CalendarApp from './components/calendarApp'
import CurrentOrderInfo from './components/currentOrderInfo'
import CurrentOrderList from './components/currentOrderList'
import OrderCommandLine from './components/orderCommandLine'
import OrderEntryButtons from './components/orderEntryButtons'
import RecentOrderList from './components/recentOrderList';

import { CustomerProvider } from './dataContexts/CustomerContext';
import { RouteProvider } from './dataContexts/RouteContext';
import { OrdersProvider } from './dataContexts/OrdersContext';

import './App.css';



function App() {

  return (
    <CustomerProvider>
    <RouteProvider>
    <OrdersProvider>
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
    </OrdersProvider>
    </RouteProvider>
    </CustomerProvider>
  );
}

export default App;
