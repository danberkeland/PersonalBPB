import React from 'react';
import { Customers } from './currentOrderInfo/Customers'
import { DeliveryDate } from './currentOrderInfo/DeliveryDate'

const CurrentOrderInfo = () => {

  return (   
    <React.Fragment>
    <h2>Cart Order for</h2>  
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
