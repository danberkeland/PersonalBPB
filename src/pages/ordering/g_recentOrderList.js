import React from 'react';

import RecentOrderList from './g_recentOrderList/RecentOrderList';
import RecentOrderListButtons from './g_recentOrderList/RecentOrderListButtons';

import styled from 'styled-components'

const RecentList = styled.div`
  text-align: left;
  box-sizing: border-box;
  height: 12px;
  width: 100%;
  margin: 5px 0;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: transparent;  
  `

const RecentOrders = () => {

  return (
      <React.Fragment>  
        <h2>Recent Orders</h2>
        
        <RecentOrderList />
        
        <RecentOrderListButtons />
        
    </React.Fragment>  
  );
}

export default RecentOrders;