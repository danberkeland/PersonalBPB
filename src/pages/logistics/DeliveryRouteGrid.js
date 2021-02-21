import React, { useContext } from 'react';


import Calendar from '../../reusableComponents/calendar'
import DeliveryDate from '../../reusableComponents/deliveryDate'
import ByRoute from './ByRoute'
import Routes from '../../reusableComponents/routes'

import { CustomerContext, CustomerLoad } from '../../dataContexts/CustomerContext'
import { OrdersContext, OrdersLoad } from '../../dataContexts/OrdersContext'
import { ProductsContext, ProductsLoad } from '../../dataContexts/ProductsContext'
import { StandingContext, StandingLoad } from '../../dataContexts/StandingContext'
import LogisticsFunctions from './LogisticsFunctions';



function Logistics() {

  const { standLoaded } = useContext(StandingContext)
  const { prodLoaded } = useContext(ProductsContext)
  const { custLoaded } = useContext(CustomerContext)
  const { ordersLoaded } = useContext(OrdersContext)

  return (
      <div className = "logisticsContainer">
        <LogisticsFunctions />
        {!standLoaded ? <StandingLoad /> : ''}
        {!prodLoaded ? <ProductsLoad /> : ''}
        {!custLoaded ? <CustomerLoad /> : ''}
        {!ordersLoaded ? <OrdersLoad /> : ''}
        <div className = "calendarContainer">
          <Calendar />
        </div>
        <div className = "logisticsDisplayContainer">
          <div id="orderCommand" />
            <div className = "logisticsInfoSearch">
                <DeliveryDate />
                <Routes />
                <button>Print</button>
                <button>Refresh</button>
            </div>  
            <ByRoute />
        </div> 
      </div>          
  );
}

export default Logistics;
