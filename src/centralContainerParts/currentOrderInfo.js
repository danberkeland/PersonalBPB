import React from 'react';

function currentOrderInfo() {
  return (     
    <div className = "currentOrderInfo">
      <h2>Current Order</h2>
      <label for="customers">Customer:</label>
      <select id="customers" name="customers">
        <option value="Novo">Novo</option>
        <option value="Novo">Linnaea's</option>
        <option value="Novo">Kreuzberg</option>
        <option value="Novo">Luna Red</option>
      </select>
      <br />
      <label for="deliveryDate">Delivery Date:</label>
      <input type="text" id="delveryDate" name="deliveryDate"></input>
      <br />
      <label for="routes">Routes:</label>
      <select id="routes" name="routes">
        <option value="Novo">AM North</option>
        <option value="Novo">AM Pastry</option>
        <option value="Novo">Lunch</option>
        <option value="Novo">North Run</option>
      </select>
      <br />
      <label for="PONotes">PO/Notes:</label>
      <input type="text" id="PONotes" name="PONotes"></input>
    </div>
      
  );
}

export default currentOrderInfo;
