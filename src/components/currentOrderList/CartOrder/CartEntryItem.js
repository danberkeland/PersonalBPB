import React, { useEffect, useContext, useCallback } from 'react';

import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';

import { convertDatetoBPBDate, convertDatetoStandingDate } from '../../../helpers/dateTimeHelpers';
import { CustDateRecentContext } from '../../../dataContexts/CustDateRecentContext';



const CartEntryItem = () => {

    const{ chosen, delivDate } = useContext(CustDateRecentContext)
    const { orders, thisOrder, setThisOrder } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    


    useEffect(() => {

        let BPBDate = convertDatetoBPBDate(delivDate)
        let standingDate = convertDatetoStandingDate(delivDate);

        let cartList = orders ? orders.filter(order => order[0] === BPBDate && order[8] === chosen)
                                .map(order => [order[2],order[7],order[8],order[4],order[6]]) : [];

        let standingList = standing ? standing.filter(standing => standing[0] === standingDate && standing[8] === chosen)
                                .map(order => [order[2],order[7],order[8],order[4],order[6]]) : [];


        let orderList;
        if (cartList.length>0){
            orderList = cartList;
        } else if (standingList.length>0){
            orderList = standingList;
        } else {
            orderList = []
        }

        setThisOrder(orderList)
    }, [chosen, delivDate, orders, standing, setThisOrder]);



    const handleRemove = useCallback((e) => {
        let itemSearch = e.target.id + "item";
        let item = document.getElementById(itemSearch).name;
        const newArray = [...thisOrder];
        let index = newArray.findIndex(order => order[1] === item)
        newArray[index][0] = "0"
        setThisOrder(newArray)
    }, [thisOrder, setThisOrder ])

    const handleInput = (e) => {
        if(e.keyCode === 13){
            document.getElementById("orderCommand").focus()
        }
        let newQty = e.target.value;
        const arrayToManipulate = [...thisOrder];
        let productIndex = arrayToManipulate.findIndex(order => order[1] === e.target.name)
        arrayToManipulate[productIndex][0] = newQty
        setThisOrder(arrayToManipulate)
    }


    return (
        <React.Fragment> 
            <label>PRODUCT</label>
            <label>QTY</label>
            <label></label>
            {thisOrder.map(order => 

                order[0] === "0" ? <React.Fragment key={order[1]+"blank"}>
                    </React.Fragment> :

                <React.Fragment key={order[1]+"frag"}>
                    <label key={order[1]+"label"}>{order[1]}</label>
                    <input  type="text" 
                            key={order[1]+"item"} 
                            id={order[1]+"item"} 
                            name={order[1]} 
                            placeholder={order[0]} 
                            onKeyUp={e => handleInput(e)}>
                    </input>
                    <button onClick={handleRemove} 
                            key={order[1]+"button"} 
                            id={order[1]}>
                                
                                REMOVE
                                
                    </button>
                </React.Fragment> 
            )}  
        </React.Fragment>
        
    )
};

export default CartEntryItem