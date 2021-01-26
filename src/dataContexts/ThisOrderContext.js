import React, { useState, createContext } from 'react';


export const ThisOrderContext = createContext();

export const ThisOrderProvider = (props) => {
    const [thisOrder, setThisOrder] = useState([])
    
    return (
        <ThisOrderContext.Provider value={{thisOrder, setThisOrder}}>
            {props.children}
        </ThisOrderContext.Provider>
    );
}