import React from 'react';



import CalendarApp from './components/calendarApp'
import CurrentOrderInfo from './components/currentOrderInfo'
import CurrentOrderList from './components/currentOrderList'
import OrderCommandLine from './components/orderCommandLine'
import OrderEntryButtons from './components/orderEntryButtons'
import RecentOrderList from './components/recentOrderList';
import OrderingFunctions from './components/OrderingFunctions'



function Ordering() {

  return (
      <div className = "mainContainer">
        <OrderingFunctions />
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
