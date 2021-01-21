import React from 'react';


function currentOrderInfo({routes, customers, chosen, onSelect}) {

  return (   
    <React.Fragment>
    <h2>Current Order</h2>  
    <div className = "currentOrderInfo">
      <label>Customer:</label>
      <select id="customers" name="customers" onChange={onSelect}>
        {customers.map(customer =>
          <option key={customer} value={customer}>{customer}</option> 
          )}
      </select>
      
      <label>Delivery Date:</label>
      <input type="text" id="delveryDate" name="deliveryDate"></input>
      
      <label>Routes:</label>
      <select id="routes" name="routes">
      {routes.map(route =>
          <option key={route} value={route}>{route}</option> 
          )}
      </select>
      
      <label>PO/Notes:</label>
      <input type="text" id="PONotes" name="PONotes"></input>
    </div>
    </React.Fragment>
      
  );
}

export default currentOrderInfo;
