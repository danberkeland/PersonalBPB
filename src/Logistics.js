import React from 'react';


import CalendarApp from './components/calendarApp'
import { DeliveryDate } from './components/currentOrderInfo/DeliveryDate'
import Routes from './components/currentOrderInfo/Routes'
import DeliveryGrid from './components/deilveryGrid'




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
                <DeliveryGrid />
            </div>
        </div> 
      </div>          
  );
}

export default Logistics;
