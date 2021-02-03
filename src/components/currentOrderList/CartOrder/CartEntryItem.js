import React, { useEffect, useContext, useState, useRef } from 'react';


import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';

import { convertDatetoBPBDate } from '../../../helpers/dateTimeHelpers';
import { createCartList, createStandingList, createCurrentOrderList } from '../../../helpers/sortDataHelpers';
import { createModifiedQtyPresentList, createRemovalPresentList } from '../../../helpers/handleInteractions';


const CartEntryItem = () => {

    const{ chosen, delivDate } = useContext(CurrentDataContext)
    const { orders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    
    const [ presentedList, setPresentedList ] = useState()

    let ord = useRef(orders)
   
    useEffect(() => {
        const cartList = createCartList(chosen, delivDate, ord.current)
        const standingList = createStandingList(chosen, delivDate, standing)
        const orderList = createCurrentOrderList(cartList,standingList)
        setPresentedList(orderList)
    }, [ chosen, delivDate, standing ]);


    const handleQtyModify = e => {
        let modifiedQtyPresentedList = createModifiedQtyPresentList(e, presentedList)
        console.log(orders)
        console.log(presentedList)
        setPresentedList(modifiedQtyPresentedList)   
    }

    const handleRemove = e => {
        let removalPresentedList = createRemovalPresentList(e, presentedList)
        setPresentedList(removalPresentedList)
    }


    return (
        <React.Fragment> 
            <label>PRODUCT</label>
            <label>QTY</label>
            <label>PREV</label>
            <label></label>
            
            {presentedList ? presentedList.map(order => 

                order[0] === convertDatetoBPBDate(delivDate) && order[0] === "0" && order[5] === "0" ? 

                <React.Fragment key={order[1]+"a"}></React.Fragment> :

                <React.Fragment key={order[1]+"b"}>
                    <label key={order[1]}>{order[1]}</label>   
                    <input  type="text" 
                            size="4"
                            maxLength="5"
                            key={order[1]+"c"} 
                            id={order[1]+"item"} 
                            name={order[1]} 
                            placeholder={order[0]} 
                            onKeyUp={e => {handleQtyModify(e)}}
                            onBlur={(e) => {
                                console.log("Triggered lost focus "+e.target.value)
                                e.target.value = ''
                                console.log(e.target.value+" is new value")
                            }}
                            >
                    </input>
                    <label key={order[1]+"d"} className="previous">{order[5] === order[0] ? '' : order[5]}</label>
                    <button onClick={handleRemove} 
                            key={order[1]+"e"} 
                            id={order[1]}>
                                
                                REMOVE
                                
                    </button>
                </React.Fragment> 
            ) : ''}  
        </React.Fragment>
        
    )
};

export default CartEntryItem