import React from 'react';

import RecentOrderList from './recentOrderList/RecentOrderList';
import RecentOrderListButtons from './recentOrderList/RecentOrderListButtons';



const RecentOrders = () => {

  return (
      <React.Fragment>  
        <h2>Recent Orders</h2>
        <div className = "recentOrdersList">   
        <RecentOrderList />
        </div>
        <RecentOrderListButtons />
        
    </React.Fragment>  
  );
}

export default RecentOrders;
