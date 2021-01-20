import React from 'react';
import './centralContainer.css'
import CurrentOrderInfo from './centralContainerParts/currentOrderInfo'
import CurrentOrderList from './centralContainerParts/currentOrderList'
import OrderCommandLine from './centralContainerParts/orderCommandLine'
import OrderEntryButtons from './centralContainerParts/orderEntryButtons'

function centralContainer() {
  return (     
    <div className = "centralContainer">
      <CurrentOrderInfo />
      <CurrentOrderList />
      <OrderCommandLine />
      <OrderEntryButtons />
    </div>   
  );
}

export default centralContainer;
