import React from 'react';

import CurrentOrderInfo from './centralContainerParts/currentOrderInfo'
import CurrentOrderList from './centralContainerParts/currentOrderList'
import OrderCommandLine from './centralContainerParts/orderCommandLine'
import OrderEntryButtons from './centralContainerParts/orderEntryButtons'

function centralContainer({routes, customers, orders, chosen, onSelect}) {
  return (     
    <div className = "centralContainer">
      <CurrentOrderInfo 
        onSelect={onSelect} 
        chosen={chosen} 
        routes={routes} 
        customers={customers}/>
      <CurrentOrderList 
        chosen={chosen} 
        orders={orders}/>
      <OrderCommandLine />
      <OrderEntryButtons />
    </div>   
  );
}

export default centralContainer;
