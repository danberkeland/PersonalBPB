import React, { useState, createContext } from 'react';

import { tomorrow } from '../helpers/dateTimeHelpers'

require('dotenv').config()

export const CustDateRecentContext = createContext();


export const CustDateRecentProvider = (props) => {

    const [chosen, setChosen] = useState('');
    const [delivDate, setDelivDate] = useState(tomorrow());
    const [recent, setRecent] = useState([]);
    const [orderTypeWhole, setorderTypeWhole] = useState(true)

    return (
        <CustDateRecentContext.Provider 
            value={{ chosen, setChosen, delivDate, setDelivDate, recent, setRecent, orderTypeWhole, setorderTypeWhole }}>
            {props.children}
        </CustDateRecentContext.Provider>
    );   
    
};

