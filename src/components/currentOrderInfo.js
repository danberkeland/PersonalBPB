import React, { useContext } from 'react';
import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';
import { Customers } from './currentOrderInfo/Customers'
import { DeliveryDate } from './currentOrderInfo/DeliveryDate'
import PONotes from './currentOrderInfo/PONotes'
import Routes from './currentOrderInfo/Routes'

const CurrentOrderInfo = () => {

const { orderType } = useContext(CustDateRecentContext)

  return (   
    <React.Fragment>
      {orderType ? <h2>Wholesale Cart Order</h2> : <h2>Retail Cart Order</h2>}
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
