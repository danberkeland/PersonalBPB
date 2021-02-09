import { cloneDeep } from 'lodash';
import React, { useContext } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';

import { convertDatetoBPBDate, convertDatetoBPBDateMinusYear, convertDatetoStandingDate } from '../../helpers/dateTimeHelpers';



const RecentOrderList = () => {

  const { orders, setOrders, recentOrders, setRecentOrders, originalOrders } = useContext(OrdersContext)
  const { standing, setStanding, originalStanding } = useContext(StandingContext)
  const { setChosen, setDelivDate,setOrderTypeWhole } = useContext(CurrentDataContext)


  
  const handleClick = async (e) => {
    let str = e.target.dataset.whole.toString()
    if (str === 'true'){
      setOrderTypeWhole(true)
    } else {
      setOrderTypeWhole(false)
    }
    
    document.getElementById('orderCommand').focus()
    setChosen(e.target.dataset.cust)  
    setDelivDate(e.target.dataset.date)   
  }

  const handleRemove = async (e) => {

    if (e.target.dataset.cart === "true") {
        
        let originalOrdersToAddBack = cloneDeep(originalOrders)
        
        originalOrdersToAddBack = originalOrdersToAddBack.filter(order => order[2] === e.target.dataset.cust &&
            order[7] === convertDatetoBPBDate(e.target.dataset.date))

        let ordersToModify = cloneDeep(orders);
        
        ordersToModify = ordersToModify.filter(order => order[2] !== e.target.dataset.cust &&
          order[7] !== convertDatetoBPBDate(e.target.dataset.date))

        let ordersToUpdate = originalOrdersToAddBack.concat(ordersToModify);

        setOrders(ordersToUpdate)
        

    } else {
        let originalStandingToAddBack = cloneDeep(originalStanding)

        originalStandingToAddBack = originalStandingToAddBack.filter(stand => stand[8] === e.target.dataset.cust)

        let standingToModify = cloneDeep(standing);
        console.log(standingToModify)

        standingToModify = standingToModify.filter(stand => stand[8] !== e.target.dataset.cust)

        let standingToUpdate = originalStandingToAddBack.concat(standingToModify)

        setStanding(standingToUpdate)

    }
      


      let recentToMod = cloneDeep(recentOrders)
  
      let ind = await recentToMod.findIndex(recent => recent[0] === e.target.dataset.date &&
                  recent[1] === e.target.dataset.cust &&
                  recent[2].toString() === e.target.dataset.whole &&
                  recent[3].toString() === e.target.dataset.cart)

      recentToMod.splice(ind,1)
      document.getElementById('orderCommand').focus()
      setRecentOrders(recentToMod)
      
  }
  

  return (
      <React.Fragment>      
        <div className="recentOrderListGrid">
          {recentOrders.map(order => <React.Fragment key={order[0]+"_"+order[1]+"_"+order[2]+"frag"} >
                                        <button className="trashButton"
                                          data-date={order[0]}
                                          data-cust={order[1]}
                                          data-whole={order[2]}
                                          data-cart={order[3]}
                                          onClick={e => {handleRemove(e)}} 
                                          key={order[0]+"_"+order[1]+"_"+order[2]+"trash"} 
                                          name={order[0]+"_"+order[1]+"_"+order[2]+"_"+order[3]}
                                          id={order[0]+"_"+order[1]+"_"+order[2]}>🗑️</button>
                                        <button 
                                          key={order[0]+"_"+order[1]+"_"+order[2]} 
                                          name={order[0]+"_"+order[1]+"_"+order[2]+"_"+order[3]}
                                          className = "recentOrderList"
                                          data-date={order[0]}
                                          data-cust={order[1]}
                                          data-whole={order[2]}
                                          data-cart={order[3]}
                                          onClick = {e => handleClick(e)}
                                          >

                                              {order[3] ? convertDatetoBPBDateMinusYear(order[0])+" ": ""}  
                                              {order[1]} 
                                              {order[2] ? "": "RETAIL"}
                                              {order[3] ? "": order[4] ? " (SO)" : " (HO)"}

                                        </button>
                                        </React.Fragment>)}      
        </div>
    </React.Fragment>  
  );
}

export default RecentOrderList;