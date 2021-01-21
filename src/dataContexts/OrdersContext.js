import React, { useState, createContext } from 'react';


export const OrdersContext = createContext();

export const OrdersProvider = (props) => {
    const [orders, setOrder] = useState([
        {date: "1/20/2020", cust: "Novo", item: "Baguette", qty: 5},
        {date: "1/20/2020", cust: "Novo", item: "Croissant", qty: 4},
        {date: "1/20/2020", cust: "Linnaeas", item: "Baguette", qty: 5},
        {date: "1/20/2020", cust: "Kraken", item: "Baguette", qty: 5}
        ])                          
    
    
    return (
        <OrdersContext.Provider value={[orders, setOrder]}>
            {props.children}
        </OrdersContext.Provider>
    );
}







