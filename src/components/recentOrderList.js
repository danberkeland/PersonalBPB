import React, { useContext } from 'react';
import { OrdersContext } from '../dataContexts/OrdersContext';



const RecentOrderList = () => {

  const { recentOrders } = useContext(OrdersContext)

  return (
      <React.Fragment>      
        <h2>Recent Orders</h2>
        <div className = "recentOrdersList">
          {recentOrders.map(order => <p>{order[0]+" "+order[1]}</p>)}      
        </div>
        <button>Upload</button><br />
        <button>Remove Selected</button>
    </React.Fragment>  
  );
}

export default RecentOrderList;
