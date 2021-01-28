import React from 'react';

import CartEntryItem from './currentOrderList/CartOrder/CartEntryItem'
import AddCartEntryItem from './currentOrderList/CartOrder/AddCartEntryItem'


const CurrentOrderList = () => {

  
  return ( 
    <React.Fragment>
        <div className = "currentOrderList">   
          <CartEntryItem />  
        </div>
        <AddCartEntryItem />
    </React.Fragment>
     
  );
}

export default CurrentOrderList;
