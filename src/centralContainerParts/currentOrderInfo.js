import React from 'react';

function currentOrderInfo({routes, customers, chosen, onSelect}) {

  return (     
    <div className = "currentOrderInfo">
      <h2>Current Order</h2>
      <label>Customer:</label>
      <select id="customers" name="customers" onChange={onSelect}>
        {customers.map(customer =>
          <option key={customer} value={customer}>{customer}</option> 
          )}
      </select>
      <br />
      <label>Delivery Date:</label>
      <input type="text" id="delveryDate" name="deliveryDate"></input>
      <br />
      <label>Routes:</label>
      <select id="routes" name="routes">
      {routes.map(route =>
          <option key={route} value={route}>{route}</option> 
          )}
      </select>
      <br />
      <label>PO/Notes:</label>
      <input type="text" id="PONotes" name="PONotes"></input>
    </div>
      
  );
}

export default currentOrderInfo;
