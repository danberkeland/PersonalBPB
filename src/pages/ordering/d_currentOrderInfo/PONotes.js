import React, { useContext } from 'react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';

import { buildCurrentOrder, addNewInfoToOrders } from '../../../helpers/CartBuildingHelpers'


const PONotes = () => {

    const { ponote, setPonote, chosen, delivDate } = useContext(CurrentDataContext)
    const { PONoteIsOn, editOn } = useContext(ToggleContext)
    const { orders, setOrders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)


    const handleNewPonote = (e) => {

        let newPonote = e.target.value
        if (e.keyCode === 13) {
            document.getElementById('orderCommand').focus()
            document.getElementById('PONotes').value = '';
        
            if (editOn) {
                let currentOrderList = buildCurrentOrder(chosen,delivDate,orders,standing)
 
                if(currentOrderList){
                    currentOrderList.map(item => item[3] = newPonote)
                }
                let updatedOrders = addNewInfoToOrders(currentOrderList, orders)
                setOrders(updatedOrders)
            }
        }
        setPonote(newPonote)
    }


    return (
        <React.Fragment>
            <label>PO/Notes:</label>
            <input type="text" id="PONotes" name="PONotes" placeholder={ponote} onKeyUp={handleNewPonote} disabled={PONoteIsOn ? false : true}></input>
        </React.Fragment>
    );
};

export default PONotes