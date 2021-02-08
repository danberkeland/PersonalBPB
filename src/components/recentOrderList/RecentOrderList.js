import React, { useContext } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';

import { OrdersContext } from '../../dataContexts/OrdersContext';
import { convertDatetoBPBDateMinusYear } from '../../helpers/dateTimeHelpers';



const RecentOrderList = () => {

  const { recentOrders } = useContext(OrdersContext)
  const { setChosen, setDelivDate,setOrderTypeWhole } = useContext(CurrentDataContext)


  
  const handleClick = async (e) => {
    let str = e.target.dataset.whole.toString()
    if (str === 'true'){
      setOrderTypeWhole(true)
    } else {
      setOrderTypeWhole(false)
    }
    
    setChosen(e.target.dataset.cust)
    setDelivDate(e.target.dataset.date)   
  }

  const handleRemove = (e) => {

  }
  

  return (
      <React.Fragment>      
        <div className="recentOrderListGrid">
          {recentOrders.map(order => <React.Fragment>
                                        <button className="trashButton"
                                          onClick={e => {handleRemove(e)}} 
                                          key={order[0]+"_"+order[1]+"_"+order[2]} 
                                          name={order[0]+"_"+order[1]+"_"+order[2]}
                                          id={order[0]+"_"+order[1]+"_"+order[2]}>🗑️</button>
                                        <button 
                                          key={order[0]+"_"+order[1]+"_"+order[2]} 
                                          className = "recentOrderList"
                                          data-date={order[0]}
                                          data-cust={order[1]}
                                          data-whole={order[2]}
                                          onClick = {handleClick}
                                          >

                                              {convertDatetoBPBDateMinusYear(order[0])+" "+order[1]}   
                                              {order[2] ? "": "RETAIL"}
                                              {order[3] ? "": " (SO)"}

                                        </button>
                                        </React.Fragment>)}      
        </div>
    </React.Fragment>  
  );
}

export default RecentOrderList;