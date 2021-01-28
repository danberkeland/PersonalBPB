import React, { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';

import { convertDatetoBPBDate, convertDatetoStandingDate } from '../../../helpers/dateTimeHelpers';
import { CustDateRecentContext } from '../../../dataContexts/CustDateRecentContext';


const CartEntryItem = () => {

    const{ chosen, delivDate } = useContext(CustDateRecentContext)
    const { orders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)

    const [thisOrder, setThisOrder] = useState([]);
   

    useEffect(() => {

        let BPBDate = convertDatetoBPBDate(delivDate)
        let standingDate = convertDatetoStandingDate(delivDate);

        let cartList = orders ? orders.filter(order => order[0] === BPBDate && order[8] === chosen)
                                .map(order => [order[2],order[7],order[8]]) : [];

        let standingList = standing ? standing.filter(standing => standing[0] === standingDate && standing[8] === chosen)
                                .map(order => [order[2],order[7],order[8]]) : [];


        let orderList;
        if (cartList.length>0){
            orderList = cartList;
        } else if (standingList.length>0){
            orderList = standingList;
        } else {
            orderList = []
        }

        setThisOrder(orderList)
    }, [chosen, delivDate, orders, standing]);

    return (
        <div className = "currentOrderList"> 
            <label>PRODUCT</label>
            <label>QTY</label>
            <label></label>
            {thisOrder.map(order => 
                <React.Fragment>
                    <label key={uuidv4()}>{order[1]}</label>
                    <input type="text" key={uuidv4()} id={order[1]} name={order[2]} placeholder={order[0]}></input>
                    <button key={uuidv4()}>REMOVE</button>
                </React.Fragment>)}     
        </div>   
    );
};

export default CartEntryItem