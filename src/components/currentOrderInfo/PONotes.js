import React, { useContext } from 'react';

import { useEffect } from 'react/cjs/react.development';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';

import { findCurrentPonote } from '../../helpers/sortDataHelpers';


const PONotes = () => {

    const { orders } = useContext(OrdersContext);
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