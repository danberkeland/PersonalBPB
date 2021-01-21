
import React, { useState, createContext } from 'react';


export const CustomerContext = createContext();

export const CustomerProvider = (props) => {
    const [customers, setCustomer] = useState(["Novo","Linnaeas","Kraken","High St."])
    const [chosen, setChosen] = useState();
    
    return (
        <CustomerContext.Provider value={[customers, setCustomer, chosen, setChosen]}>
            {props.children}
        </CustomerContext.Provider>
    );
}




