import React, { useContext } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';

import { OrdersContext } from '../../dataContexts/OrdersContext';



const RecentOrderList = () => {

  const { recentOrders } = useContext(OrdersContext)
  const { setChosen, setDelivDate } = useContext(CurrentDataContext)

  const handleClick = (e) => {
    setChosen(e.target.dataset.cust)
    setDelivDate(e.target.dataset.date)
  }

  return (
      <React.Fragment>      
        <h2>Recent Orders</h2>
        <div>
          {recentOrders.map(order => <button 
                                        key={uuidv4()} 
                                        className = "recentOrderList"
                                        data-date={order[0]}
                                        data-cust={order[1]}
                                        onClick = {handleClick}>
                                            
                                            {order[0]+" "+order[1]}
                                            
                                        </button>)}      
        </div>
    </React.Fragment>  
  );
}

export default RecentOrderList;