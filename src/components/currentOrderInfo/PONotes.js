import React, { useContext, useEffect } from 'react';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';

import { findCurrentPonote } from '../../helpers/sortDataHelpers';
import { convertDatetoBPBDate, convertDatetoStandingDate } from '../../helpers/dateTimeHelpers'


const clonedeep = require('lodash.clonedeep')

const PONotes = () => {

    const { orders, setOrders } = useContext(OrdersContext);
    const { standing } = useContext(StandingContext)
    const { chosen, delivDate, ponote, setPonote } = useContext(CurrentDataContext)

    useEffect(() => {
        let po = findCurrentPonote(chosen, delivDate, orders)
        document.getElementById('PONotes').value = '';
        setPonote(po)

    },[chosen, delivDate, setPonote, orders])

    const handleNewPonote = (e) => {
        if (e.keyCode === 13) {
            setPonote(e.target.value)
            document.getElementById('orderCommand').focus()
        

            let newPonote = e.target.value
             // BUILD PRESENT LIST
            // Build Orders List based on delivDate and Chosen
            let BPBDate = convertDatetoBPBDate(delivDate)
            let filteredOrders = clonedeep(orders)
            let cartList = filteredOrders ? filteredOrders.filter(order => order[7] === BPBDate && order[2] === chosen) : [];
            
            // Build Standing List based on delivDate and Chosen
            let standingDate = convertDatetoStandingDate(delivDate);  
            let filteredStanding = clonedeep(standing)
            let standingList = filteredStanding ? filteredStanding.filter(standing => standing[0] === standingDate && standing[8] === chosen) : [];
            let convertedOrderList = standingList.map(order => [    order[2],
                                                                    order[7],
                                                                    order[8],
                                                                    'na',
                                                                    order[6],
                                                                    order[2], 
                                                                    order[3] !== "9999" ? true : false,
                                                                    standingDate])
            
            // Compare Order List to Stand List and give Order List precedence in final list                                                        
            let orderList = cartList.concat(convertedOrderList)
            for (let i=0; i<orderList.length; ++i ){
                for (let j=i+1; j<orderList.length; ++j){
                    if (orderList[i][1] === orderList[j][1]){
                        orderList.splice(j,1);
                    }
                }
            }
        
        
            // set route if route has changed
            if (orderList) {
                orderList.map(item => item[3] = newPonote)
            }   
        
            let recent = clonedeep(orders)
            let newOrderList = orderList.concat(recent)
                for (let i=0; i<newOrderList.length; ++i ){
                    for (let j=i+1; j<newOrderList.length; ++j){
                        if (  newOrderList[i][1] === newOrderList[j][1] &&
                              newOrderList[i][2] === newOrderList[j][2] &&
                              newOrderList[i][7] === newOrderList[j][7]){
                            newOrderList.splice(j,1);
                        }
                    }
                  }
              
            if (newOrderList){
              setOrders(newOrderList)
            
            setPonote(newPonote);
            }
        }
    }

   

    return (
        <React.Fragment>
            <label>PO/Notes:</label>
            <input type="text" id="PONotes" name="PONotes" placeholder={ponote} onKeyUp={handleNewPonote} disabled={chosen ? false : true}></input>
        </React.Fragment>
    );
};

export default PONotes