import React, { useContext } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';

import { OrdersContext } from '../../dataContexts/OrdersContext';
import { convertDatetoBPBDate } from '../../helpers/dateTimeHelpers';



const RecentOrderList = () => {

  const { orders, recentOrders } = useContext(OrdersContext)
  const { setChosen, setDelivDate,setorderTypeWhole } = useContext(CurrentDataContext)


  /*
  const handleClick = async (e) => {
    let str = e.target.dataset.whole.toString()
    if (str === 'true'){
      setorderTypeWhole(true)
    } else {
      setorderTypeWhole(false)
    }
    
    setChosen(e.target.dataset.cust)
    setDelivDate(e.target.dataset.date)   
  }
  */

  return (
      <React.Fragment>      
        <h2>Recent Orders</h2>
        <div>
          {recentOrders.map(order => <button 
                                        key={uuidv4()} 
                                        className = "recentOrderList"
                                        data-date={order[0]}
                                        data-cust={order[1]}
                                        data-whole={order[2]}
                                        // onClick = {handleClick}
                                        >
                                            
                                            {convertDatetoBPBDate(order[0])+" "+order[1]}   {order[2] ? "": "RETAIL"}
                                            
                                        </button>)}      
        </div>
    </React.Fragment>  
  );
}

export default RecentOrderList;