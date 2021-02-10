import React, { useState, createContext } from 'react';

import { tomorrow } from '../helpers/dateTimeHelpers'


export const CurrentDataContext = createContext();


export const CurrentDataProvider = (props) => {

    const [chosen, setChosen] = useState('');
    const [delivDate, setDelivDate] = useState(tomorrow());
    const [ ponote, setPonote ] = useState('na')
    const [route, setRoute ] = useState()
    const [orderTypeWhole, setOrderTypeWhole] = useState(true)
    const [ ordersHasBeenChanged, setOrdersHasBeenChanged ] = useState(false);
    const [ modifications, setModifications ] = useState(false)

    return (
        <CurrentDataContext.Provider 
            value={{    chosen, setChosen, 
                        delivDate, setDelivDate, 
                        ponote, setPonote,
                        route, setRoute,
                        orderTypeWhole, setOrderTypeWhole,
                        ordersHasBeenChanged, setOrdersHasBeenChanged,
                        modifications, setModifications
                        }}>
            {props.children}
        </CurrentDataContext.Provider>
    );   
    
};

