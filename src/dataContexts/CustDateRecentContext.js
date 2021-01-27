import React, { useState, createContext } from 'react';

import { tomorrow } from '../helpers/dateTimeHelpers'

require('dotenv').config()

export const CustDateRecentContext = createContext();


export const CustDateRecentProvider = (props) => {

    const [chosen, setChosen] = useState('Novo');
    const [delivDate, setDelivDate] = useState(tomorrow());
    const [recent, setRecent] = useState([]);

    return (
        <CustDateRecentContext.Provider value={{ chosen, setChosen, delivDate, setDelivDate, recent, setRecent }}>
            {props.children}
        </CustDateRecentContext.Provider>
    );   
    
};

