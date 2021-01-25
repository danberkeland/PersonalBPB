import React from 'react';


import { CreateCurrentOrdersList } from '../helpers/createCurrentOrdersList';


const CurrentOrderList = () => {

  const thisOrder = CreateCurrentOrdersList();

  return (        
    <div className = "currentOrderList"> 
       {thisOrder.map(order => 
          <React.Fragment>
          <label>{order[1]}</label>
          <input type="text" id={order[2]} name={order[2]} placeholder={order[0]}></input>
          </React.Fragment>)}     
    </div>   
  );
}

export default CurrentOrderList;
