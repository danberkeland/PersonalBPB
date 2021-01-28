import React, { useContext } from 'react';
import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';
import { Customers } from './currentOrderInfo/Customers'
import { DeliveryDate } from './currentOrderInfo/DeliveryDate'

const CurrentOrderInfo = () => {

const { orderType } = useContext(CustDateRecentContext)

  return (   
    <React.Fragment>
      {orderType ? <h2>Wholesale Cart Order</h2> : <h2>Retail Cart Order</h2>}
    <div className = "currentOrderInfo">
      <Customers /> 
      <DeliveryDate />
      
      <label>Routes:</label>
      <select id="routes" name="routes">
      
      </select>
      
      <label>PO/Notes:</label>
      <input type="text" id="PONotes" name="PONotes"></input>
    </div>
    </React.Fragment>
      
  );
}

export default CurrentOrderInfo;
