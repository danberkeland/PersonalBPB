import React, { useContext } from 'react';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';


const PONotes = () => {

    const { chosen, ponote, setPonote } = useContext(CurrentDataContext)


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
            <input type="text" id="PONotes" name="PONotes" placeholder={ponote} onKeyUp={handleNewPonote} disabled={chosen ? false : true}></input>
        </React.Fragment>
    );
};

export default PONotes