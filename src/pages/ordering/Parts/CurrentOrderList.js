import React,{ useContext } from 'react';

import CartEntryItem from '../e_CurrentOrderList/CartOrder/CartEntryItem'
import AddCartEntryItem from '../e_CurrentOrderList/CartOrder/AddCartEntryItem'
import StandingOrderEntry from '../e_CurrentOrderList/StandingOrder/StandingOrderEntry'
import AddStandingOrderEntry from '../e_CurrentOrderList/StandingOrder/AddStandingOrderEntry'

import { ToggleContext } from '../../../dataContexts/ToggleContext';



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
