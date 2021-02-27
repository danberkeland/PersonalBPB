import { cloneDeep } from 'lodash';
import React, { useContext } from 'react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';

import { Button } from 'primereact/button';

import { convertDatetoBPBDate, convertDatetoBPBDateMinusYear } from '../../../helpers/dateTimeHelpers';

import styled from 'styled-components'

const RecentList = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr;
  column-gap: 10px;
  row-gap: 10px;
  `
  
const RecentButton = styled.button`
  text-align: left;
  box-sizing: border-box;
  height: 12px;
  width: 100%;
  margin: 5px 0;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  color: black;
  background-color: transparent;
  `

const RecentOrderList = () => {

  const { orders, setOrders, recentOrders, setRecentOrders, originalOrders } = useContext(OrdersContext)
  const { standing, setStanding, originalStanding } = useContext(StandingContext)
  const { setChosen, setDelivDate } = useContext(CurrentDataContext)
  const { setOrderTypeWhole, setCartList, setStandList } = useContext(ToggleContext)


  
  const handleClick = async (e) => {
    let whole = e.target.dataset.whole.toString()
    let cart = e.target.dataset.cart.toString()
    let stand = e.target.dataset.stand.toString()
    
    if (whole === 'true'){
      setOrderTypeWhole(true)
    } else {
      setOrderTypeWhole(false)
    }

    if (cart === 'true'){
      setCartList(true)
    } else {
      setCartList(false)
    }

    if (stand === 'true'){
      setStandList(true)
    } else {
      setStandList(false)
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
       <RecentList>
          {recentOrders.map(order => <React.Fragment key={order[0]+"_"+order[1]+"_"+order[2]+"frag"} >
                                        <Button 

                                          icon="pi pi-trash" 
                                          className="p-button-raised p-button-rounded p-button-warning p-button-sm"
                                          data-date={order[0]}
                                          data-cust={order[1]}
                                          data-whole={order[2]}
                                          data-cart={order[3]}
                                          onClick={e => {handleRemove(e)}} 
                                          key={order[0]+"_"+order[1]+"_"+order[2]+"trash"} 
                                          name={order[0]+"_"+order[1]+"_"+order[2]+"_"+order[3]}
                                          id={order[0]+"_"+order[1]+"_"+order[2]}></Button>
                                        <RecentButton
                                          
                                          key={order[0]+"_"+order[1]+"_"+order[2]} 
                                          name={order[0]+"_"+order[1]+"_"+order[2]+"_"+order[3]}
                                          data-date={order[0]}
                                          data-cust={order[1]}
                                          data-whole={order[2]}
                                          data-cart={order[3]}
                                          data-stand={order[4]}
                                          onClick = {e => handleClick(e)}
                                          >

                                              {order[3] ? convertDatetoBPBDateMinusYear(order[0])+" ": ""}  
                                              {order[1]} 
                                              {order[2] ? "": "RETAIL"}
                                              {order[3] ? "": order[4] ? " (SO)" : " (HO)"}

                                        </RecentButton>
                                        </React.Fragment>)}      
      </RecentList>
    </React.Fragment>  
  );
}

export default RecentOrderList;