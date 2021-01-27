import React from 'react';
import { Customers } from './currentOrderInfo/Customers'

const CurrentOrderInfo = () => {

  return (   
    <React.Fragment>
    <h2>Cart Order for</h2>  
    <div className = "currentOrderInfo">
      <Customers />
      
      <label>Delivery Date:</label>
      <input type="text" id="deliveryDate" name="deliveryDate" placeholder="nothing"></input>
      
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
