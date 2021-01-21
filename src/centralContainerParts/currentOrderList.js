import React from 'react';



function currentOrderList({chosen, orders}) {
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

export default currentOrderList;
