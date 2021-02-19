import React from 'react';


import Calendar from './reusableComponents/calendar'
import DeliveryDate from './reusableComponents/deliveryDate'
import ByCustomer from './pages/logistics/ByCustomer'




function Logistics() {

  return (
      <div className = "logisticsContainer">
        <div className = "calendarContainer">
          <Calendar />
        </div>
        <div className = "logisticsDisplayContainer">
            <div className = "logisticsInfoSearch">
                <div id="orderCommand" />
                <DeliveryDate />
                <ByCustomer />
            </div>  
        </div> 
      </div>          
  );
}

export default Logistics;
