import React from 'react';


import CalendarApp from './components/calendarApp'
import CurrentOrderInfo from './components/currentOrderInfo'
import CurrentOrderList from './components/currentOrderList'
import OrderCommandLine from './components/orderCommandLine'
import OrderEntryButtons from './components/orderEntryButtons'
import RecentOrderList from './components/recentOrderList';


import './App.css';
import { CustomerProvider } from './dataContexts/CustomerContext';
import { OrdersProvider } from './dataContexts/OrdersContext';



function App() {

  return (
    
    <CustomerProvider>
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
    </CustomerProvider>
           
  );
}

export default App;
