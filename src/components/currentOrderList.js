import React, { useContext } from 'react';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { CustomerContext } from '../dataContexts/CustomerContext';


const CurrentOrderList = () => {

  const [orders, setOrder] = useContext(OrdersContext);
  const [customers, setCustomer, chosen, setChosen] = useContext(CustomerContext);

  return (        
    <div className = "currentOrderList"> 
       {orders.map(order => order.cust === chosen ?
          <React.Fragment>
          <label>{order.item}</label>
          <input type="text" id={order.cust} name={order.cust} value={order.qty}></input>
          </React.Fragment> : ''
      )}   
      
    </div>   
  );
}

export default CurrentOrderList;
