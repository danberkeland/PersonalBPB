import React from 'react';

import RecentOrderList from './recentOrderList/RecentOrderList';
import RecentOrderListButtons from './recentOrderList/RecentOrderListButtons';



const RecentOrders = () => {

  return (
      <React.Fragment>  
        <div className = "recentOrdersList">   
        <RecentOrderList />
        </div>
        <RecentOrderListButtons />
        
    </React.Fragment>  
  );
}

export default RecentOrders;
