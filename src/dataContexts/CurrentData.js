import React, { useState, createContext } from 'react';

import { tomorrow } from '../helpers/dateTimeHelpers'

require('dotenv').config()

export const CustDateRecentContext = createContext();


export const CurrentData = (props) => {

    const [chosen, setChosen] = useState('');
    const [delivDate, setDelivDate] = useState(tomorrow());
    const [ ponote, setPonote ] = useState('na')
    const [route, setRoute ] = useState()
    const [orderTypeWhole, setorderTypeWhole] = useState(true)
    const [ thisOrderHasBeenChanged, setThisOrderHasBeenChanged ] = useState(false);

    return (
        <CustDateRecentContext.Provider 
            value={{    chosen, setChosen, 
                        delivDate, setDelivDate, 
                        ponote, setPonote,
                        route, setRoute,
                        orderTypeWhole, setorderTypeWhole,
                        thisOrderHasBeenChanged, setThisOrderHasBeenChanged
                        }}>
            {props.children}
        </CustDateRecentContext.Provider>
    );   
    
};

