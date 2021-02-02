import React, { useEffect, useContext, useState } from 'react';

import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';

import { convertDatetoBPBDate } from '../../../helpers/dateTimeHelpers';
import { createCartList, createStandingList, createCurrentOrderList } from '../../../helpers/sortDataHelpers';

const CartEntryItem = () => {

    const{ chosen, delivDate } = useContext(CurrentDataContext)
    const { orders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    
    const [ presentedList, setPresentedList ] = useState()


   
    useEffect(() => {

        let cartList = createCartList(chosen, delivDate, orders)
        let standingList = createStandingList(chosen, delivDate, standing)
        let orderList = createCurrentOrderList(cartList,standingList)

        setPresentedList(orderList)
    }, [ chosen, delivDate, orders, standing ]);


    const handleInput = e => {
        if (e.key === "Enter"){
            document.getElementById("orderCommand").focus()
        }
        let newQty = e.target.value
        let indexToFind = e.target.name
        let foundIndex = presentedList.findIndex(line => line[1] === indexToFind)
        let presentedListToModify = [...presentedList]
        presentedListToModify[foundIndex][0] = newQty
        setPresentedList(presentedListToModify)   
    }

    const handleRemove = e => {
        let newQty = 0
        let indexToFind = e.target.id
        let foundIndex = presentedList.findIndex(line => line[1] === indexToFind)
        let presentedListToModify = [...presentedList]
        presentedListToModify[foundIndex][0] = newQty
        setPresentedList(presentedListToModify)
    }


    return (
        <React.Fragment> 
            <label>PRODUCT</label>
            <label>QTY</label>
            <label>PREV</label>
            <label></label>
            
            {presentedList ? presentedList.map(order => 

                order[0] === convertDatetoBPBDate(delivDate) && order[0] === "0" && order[5] === "0" ? 
                
                <React.Fragment key={order[1]+"blank"}></React.Fragment> :

                <React.Fragment key={order[1]+"frag"}>
                    <label key={order[1]+"label"}>{order[1]}</label>   
                    <input  type="text" 
                            size="4"
                            maxLength="5"
                            key={order[1]+"item"} 
                            id={order[1]+"item"} 
                            name={order[1]} 
                            placeholder={order[0]} 
                            onKeyUp={e => handleInput(e)}
                            >
                    </input>
                    <label className="previous">{order[5] === order[0] ? '' : order[5]}</label>
                    <button onClick={handleRemove} 
                            key={order[1]+"button"} 
                            id={order[1]}>
                                
                                REMOVE
                                
                    </button>
                </React.Fragment> 
            ) : ''}  
        </React.Fragment>
        
    )
};

export default CartEntryItem