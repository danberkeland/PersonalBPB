import React from 'react';

const CurrentOrderInfo = () => {

  

  return (   
    <React.Fragment>
    <h2>Cart Order for</h2>  
    <div className = "currentOrderInfo">
      <label id="test">Customer:</label>
      <select id="customers" name="customers" /*</div>onChange={handleChange}*/>
        {/* {customers ? customers.map(customer => 
          <option key={customer[2]} value={customer[2]}>{customer[2]}</option> 
        ) : ''} */}
      </select>
      
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
