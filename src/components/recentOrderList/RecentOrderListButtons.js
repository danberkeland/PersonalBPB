import React,{ useContext } from 'react';

import { OrdersContext } from '../../dataContexts/OrdersContext';


require('dotenv').config()


const RecentOrderListButtons = () => {

  const { orders } = useContext(OrdersContext)

  const handleUpload = () => {
    //turn orders into json object - data
    let orderData = [...orders]

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type':'application/json'},
      body: JSON.stringify(orderData)
    };

    fetch(process.env.REACT_APP_API_SENDORDERS, requestOptions)
      .then(response => response.json())
      .then(data => console.log(data))

  }

  return (
      <React.Fragment>      
        <div>
        <button className = "recentOrderListButton" onClick={handleUpload}>Upload</button>
        </div>
    </React.Fragment>  
  );
}

export default RecentOrderListButtons;