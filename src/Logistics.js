import React from 'react';


import CalendarApp from './pages/ordering/b_calendarApp'
import { DeliveryDate } from './pages/ordering/d_currentOrderInfo/DeliveryDate'
import Routes from './pages/ordering/d_currentOrderInfo/Routes'





function Logistics() {

  return (
      <div className = "mainContainer">
        <div className = "calendarContainer">
          <CalendarApp />
        </div>
        <div className = "logisticsContainer">
            <div className = "logisticsInfoSearch">
                <DeliveryDate />
                <Routes />
            </div>
            <div className = "deliveryList">
                
            </div>
        </div> 
      </div>          
  );
}

export default Logistics;
