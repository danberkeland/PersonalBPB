import React, { useContext } from 'react';
import { useEffect } from 'react/cjs/react.development';
import { CurrentOrderContext } from '../../dataContexts/CurrentOrderContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';


const PONotes = () => {

    const { orders, thisOrder } = useContext(OrdersContext);
    const { chosen, delivDate, ponote, setPonote } = useContext(CurrentOrderContext)

    useEffect(() => {
        let po
        let currentOrders = thisOrder.filter(order => order[2] === chosen );
        if (currentOrders.length>0) {
            po = currentOrders[0][3]
        } else {
            po = "na"
        }
        document.getElementById('PONotes').value = '';
        setPonote(po)

    },[chosen, delivDate, orders, setPonote, thisOrder])

    const handleNewPonote = (e) => {
        if (e.keyCode === 13) {
            setPonote(e.target.value)
            document.getElementById('orderCommand').focus()
        }
    };

    return (
        <React.Fragment>
            <label>PO/Notes:</label>
            <input type="text" id="PONotes" name="PONotes" placeholder={ponote} onKeyUp={handleNewPonote}></input>
        </React.Fragment>
    );
};

export default PONotes