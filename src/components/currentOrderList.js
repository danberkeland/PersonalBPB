import React,{ useContext } from 'react';

import CartEntryItem from './currentOrderList/CartOrder/CartEntryItem'
import AddCartEntryItem from './currentOrderList/CartOrder/AddCartEntryItem'
import StandingOrderEntry from './currentOrderList/StandingOrder/StandingOrderEntry'
import AddStandingOrderEntry from './currentOrderList/StandingOrder/AddStandingOrderEntry'

import { ToggleContext } from '../dataContexts/ToggleContext';



const CurrentOrderList = () => {

  const { cartList } = useContext(ToggleContext);

  
  return ( 
    <React.Fragment>

        {cartList ? 
        <React.Fragment>
        <div className = "currentOrderList">   
          <CartEntryItem />  
        </div>
        <AddCartEntryItem />
        </React.Fragment> :

        <React.Fragment>
        <div className = "currentStandingList">   
          <StandingOrderEntry />  
        </div>
        <AddStandingOrderEntry />
        </React.Fragment> 
        }
    </React.Fragment>
     
  );
}

export default CurrentOrderList;
