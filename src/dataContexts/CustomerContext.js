
import React, { useState, createContext } from 'react';


export const CustomerContext = createContext();


export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);

    return (
        <CustomerContext.Provider value={{ customers, setCustomer }}>
            {props.children}
        </CustomerContext.Provider>
    );   
    
};


