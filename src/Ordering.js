import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


import CalendarApp from './components/calendarApp'
import CurrentOrderInfo from './components/currentOrderInfo'
import CurrentOrderList from './components/currentOrderList'
import OrderCommandLine from './components/orderCommandLine'
import OrderEntryButtons from './components/orderEntryButtons'
import RecentOrderList from './components/recentOrderList';
import BuildCurrentCartList from './components/currentOrderList/CartOrder/BuildCurrentCartList';



function Ordering() {

  return (
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
  );
}

export default Ordering;
