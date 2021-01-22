import React, { useContext } from 'react';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { CustomerContext } from '../dataContexts/CustomerContext';

import { convertDatetoBPBDate } from '../helpers/convertDatetoBPBDate'


const CurrentOrderList = () => {

  const [orders, setOrder, orderDate, setOrderDate] = useContext(OrdersContext);
  const [customers, setCustomer, chosen, setChosen] = useContext(CustomerContext);

  return (        
    <div className = "currentOrderList"> 
       {orders.map(order => order[8] === chosen && order[0] === convertDatetoBPBDate(orderDate) && parseInt(order[2]) > 0 ?
          <React.Fragment>
          <label>{order[7]}</label>
          <input type="text" id={order[8]} name={order[8]} placeholder={order[2]}></input>
          </React.Fragment> : ''
       )}   
      
    </div>   
  );
}

export default CurrentOrderList;
