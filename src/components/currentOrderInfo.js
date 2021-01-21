import React, { useContext } from 'react';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { RouteContext } from '../dataContexts/RouteContext';

const CurrentOrderInfo = () => {

  const [customers, setCustomer, chosen, setChosen] = useContext(CustomerContext);
  const [routes, setRoutes] = useContext(RouteContext);


  const handleChange = e => {
    setChosen(e.target.value);
  }

  return (   
    <React.Fragment>
    <h2>Current Order for {chosen}</h2>  
    <div className = "currentOrderInfo">
      <label>Customer:</label>
      <select id="customers" name="customers" onChange={handleChange}>
        {customers.map(customer =>
          <option key={customer} value={customer}>{customer}</option> 
        )}
      </select>
      
      <label>Delivery Date:</label>
      <input type="text" id="deliveryDate" name="deliveryDate"></input>
      
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

export default CurrentOrderInfo;
