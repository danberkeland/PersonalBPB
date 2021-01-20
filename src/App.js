import React, { useState } from 'react';
import CalendarContainer from './calendarContainer';
import CentralContainer from './centralContainer';
import RightContainer from './rightContainer';
import './App.css';

import getCustomerList from './dataCollectors/getCustomerList';
import getRouteList from './dataCollectors/getRouteList';
import getOrders from './dataCollectors/getOrders';


function App() {

  const [customers, setCustomers] = useState (getCustomerList());
  const [routes, setRoutes] = useState (getRouteList());
  const [orders, setOrders] = useState (getOrders());
  const [chosen, setChosen] = useState();

  const handleCustChoice = (e) => {
    console.log(e.target.value);
    setChosen(e.target.value)
  }

  return (
    <div className = "mainContainer">
      <CalendarContainer />
      <CentralContainer 
        onSelect={handleCustChoice} 
        chosen={chosen} 
        orders={orders} 
        customers={customers} 
        routes={routes} />
      <RightContainer />
    </div>
  );
}

export default App;
