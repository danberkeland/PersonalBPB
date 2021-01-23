import React from 'react';

import { CreateCurrentOrdersList } from '../helpers/createCurrentOrdersList';


const CurrentOrderList = () => {

  let orderList = CreateCurrentOrdersList();

  return (        
    <div className = "currentOrderList"> 
       {orderList.map(order => 
          <React.Fragment>
          <label>{order[1]}</label>
          <input type="text" id={order[2]} name={order[2]} placeholder={order[0]}></input>
          </React.Fragment>)}     
    </div>   
  );
}

export default CurrentOrderList;
