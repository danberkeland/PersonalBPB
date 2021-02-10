import React, { useContext } from 'react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';


const PONotes = () => {

    const { ponote, setPonote } = useContext(CurrentDataContext)
    const { PONoteIsOn } = useContext(ToggleContext)


    const handleNewPonote = (e) => {
        setPonote(e.target.value)
        if (e.keyCode === 13) {
            document.getElementById('orderCommand').focus()
            document.getElementById('PONotes').value = '';
        
        }
    }

    return (
        <React.Fragment>
            <label>PO/Notes:</label>
            <input type="text" id="PONotes" name="PONotes" placeholder={ponote} onKeyUp={handleNewPonote} disabled={PONoteIsOn ? false : true}></input>
        </React.Fragment>
    );
};

export default PONotes