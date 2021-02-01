import React, { useState, createContext } from 'react';

import { tomorrow } from '../helpers/dateTimeHelpers'

require('dotenv').config()

export const CurrentDataContext = createContext();


export const CurrentDataProvider = (props) => {

    const [chosen, setChosen] = useState('');
    const [delivDate, setDelivDate] = useState(tomorrow());
    const [ ponote, setPonote ] = useState('na')
    const [route, setRoute ] = useState()
    const [orderTypeWhole, setorderTypeWhole] = useState(true)
    const [ thisOrderHasBeenChanged, setThisOrderHasBeenChanged ] = useState(false);

    return (
        <CurrentDataContext.Provider 
            value={{    chosen, setChosen, 
                        delivDate, setDelivDate, 
                        ponote, setPonote,
                        route, setRoute,
                        orderTypeWhole, setorderTypeWhole,
                        thisOrderHasBeenChanged, setThisOrderHasBeenChanged
                        }}>
            {props.children}
        </CurrentDataContext.Provider>
    );   
    
};

