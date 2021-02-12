import React from 'react';


import Calendar from './reusableComponents/calendar'
import DeliveryDate from './reusableComponents/deliveryDate'
import Routes from './reusableComponents/routes'





function Logistics() {

  return (
      <div className = "mainContainer">
        <div className = "calendarContainer">
          <Calendar />
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
