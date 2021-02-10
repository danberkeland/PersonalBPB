import React from 'react';



import CalendarApp from './pages/ordering/b_calendarApp'
import CurrentOrderInfo from './pages/ordering/d_currentOrderInfo'
import CurrentOrderList from './pages/ordering/e_currentOrderList'
import OrderCommandLine from './pages/ordering/c_orderCommandLine'
import OrderEntryButtons from './pages/ordering/f_orderEntryButtons'
import RecentOrderList from './pages/ordering/g_recentOrderList';
import OrderingFunctions from './pages/ordering/a_OrderingFunctions'



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
