import React from 'react';



import Calendar from './reusableComponents/calendar'
import CurrentOrderInfo from './pages/ordering/d_currentOrderInfo'
import CurrentOrderList from './pages/ordering/e_currentOrderList'
import OrderCommandLine from './pages/ordering/c_orderCommandLine'
import OrderEntryButtons from './pages/ordering/f_orderEntryButtons'
import RecentOrderList from './pages/ordering/g_recentOrderList';
import OrderingFunctions from './pages/ordering/a_OrderingFunctions'

import { CustomerLoad } from './dataContexts/CustomerContext'
import { OrdersLoad } from './dataContexts/OrdersContext'
import { ProductsLoad } from './dataContexts/ProductsContext'
import { StandingLoad } from './dataContexts/StandingContext'
import { HoldingLoad } from './dataContexts/HoldingContext'



function Ordering() {

  return (
      <div className = "mainContainer">
        <StandingLoad />
        <ProductsLoad />
        <CustomerLoad />
        <OrdersLoad />
        <HoldingLoad />
        <OrderingFunctions />
        <div className = "calendarContainer">
          <Calendar />
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
