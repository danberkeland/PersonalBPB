import React, { useContext } from 'react';
import { useEffect } from 'react/cjs/react.development';
import { CustDateRecentContext } from '../../dataContexts/CustDateRecentContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';


const PONotes = () => {

    const { orders, ponotes, setPonotes, thisOrder } = useContext(OrdersContext);
    const { chosen, delivDate } = useContext(CustDateRecentContext)

    useEffect(() => {
        let po
        let currentOrders = thisOrder.filter(order => order[2] === chosen );
        if (currentOrders.length>0) {
            po = currentOrders[0][3]
        } else {
            po = "na"
        }
        setPonotes(po)

    },[chosen, delivDate, orders, setPonotes, thisOrder])

    const handleNewPonote = () => {
        return
    };

    return (
        <React.Fragment>
            <label>PO/Notes:</label>
            <input type="text" id="PONotes" name="PONotes" placeholder={ponotes} onChange={handleNewPonote}></input>
        </React.Fragment>
    );
};

export default PONotes