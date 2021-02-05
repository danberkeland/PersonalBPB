import React, { useState, createContext } from 'react';

import { tomorrow } from '../helpers/dateTimeHelpers'

require('dotenv').config()

export const CurrentDataContext = createContext();


export const CurrentDataProvider = (props) => {

    const [chosen, setChosen] = useState('');
    const [delivDate, setDelivDate] = useState(tomorrow());
    const [ ponote, setPonote ] = useState('na')
    const [route, setRoute ] = useState()
    const [orderTypeWhole, setOrderTypeWhole] = useState(true)
    const [ ordersHasBeenChanged, setOrdersHasBeenChanged ] = useState(false);

    return (
        <CurrentDataContext.Provider 
            value={{    chosen, setChosen, 
                        delivDate, setDelivDate, 
                        ponote, setPonote,
                        route, setRoute,
                        orderTypeWhole, setOrderTypeWhole,
                        ordersHasBeenChanged, setOrdersHasBeenChanged
                        }}>
            {props.children}
        </CurrentDataContext.Provider>
    );   
    
};

