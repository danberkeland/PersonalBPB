import React, { useContext} from 'react';



import Calendar from './reusableComponents/calendar'
import CurrentOrderInfo from './pages/ordering/d_currentOrderInfo'
import CurrentOrderList from './pages/ordering/e_currentOrderList'
import OrderCommandLine from './pages/ordering/c_orderCommandLine'
import OrderEntryButtons from './pages/ordering/f_orderEntryButtons'
import RecentOrderList from './pages/ordering/g_recentOrderList';
import OrderingFunctions from './pages/ordering/a_OrderingFunctions'

import { CustomerContext, CustomerLoad, FullCustomerLoad } from './dataContexts/CustomerContext'
import { OrdersContext, OrdersLoad } from './dataContexts/OrdersContext'
import { ProductsContext, ProductsLoad } from './dataContexts/ProductsContext'
import { StandingContext, StandingLoad } from './dataContexts/StandingContext'
import { HoldingContext, HoldingLoad } from './dataContexts/HoldingContext'



function Ordering() {

  const { standLoaded } = useContext(StandingContext)
  const { prodLoaded } = useContext(ProductsContext)
  const { custLoaded, fullCustLoaded } = useContext(CustomerContext)
  const { ordersLoaded } = useContext(OrdersContext)
  const { holdLoaded } = useContext(HoldingContext)

  return (
      <div className = "mainContainer">
        <OrderingFunctions />
        {!standLoaded ? <StandingLoad /> : ''}
        {!prodLoaded ? <ProductsLoad /> : ''}
        {!custLoaded ? <CustomerLoad /> : ''}
        {!fullCustLoaded ? <FullCustomerLoad /> : ''}
        {!ordersLoaded ? <OrdersLoad /> : ''}
        {!holdLoaded ? <HoldingLoad /> : ''}
        
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
