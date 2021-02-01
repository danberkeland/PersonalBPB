import React, { useContext } from 'react';
import { CurrentOrderContext } from '../dataContexts/CurrentOrderContext';
import { Customers } from './currentOrderInfo/Customers'
import { DeliveryDate } from './currentOrderInfo/DeliveryDate'
import PONotes from './currentOrderInfo/PONotes'
import Routes from './currentOrderInfo/Routes'

const CurrentOrderInfo = () => {

const { orderTypeWhole } = useContext(CurrentOrderContext)

  return (   
    <React.Fragment>
      {orderTypeWhole ? <h2>Wholesale Cart Order</h2> : <h2>Retail Cart Order</h2>}
        <div className = "currentOrderInfo">
          <Customers /> 
          <DeliveryDate />
          <Routes />
          <PONotes />
        </div>
    </React.Fragment>
      
  );
}

export default CurrentOrderInfo;
