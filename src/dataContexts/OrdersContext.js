import React, { useState, createContext } from 'react';


export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const [orders, setOrder] = useState([]);

    return (
        <OrdersContext.Provider value={{ orders, setOrder }}>
            {props.children}
        </OrdersContext.Provider>
    );   
    
};





/*
import React, { useState, createContext, useEffect } from 'react';
import { tomorrow } from '../helpers/dateTimeHelpers';


export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const [orders, setOrder] = useState([]);
    const [orderDate, setOrderDate] =useState(tomorrow());


    useEffect(() => {
        const apiUrl = "https://3rhpf3rkcg.execute-api.us-east-2.amazonaws.com/done";
        fetch(apiUrl)
        .then(res => res.json())
        .then(data => setOrder(data.body))
    },[]);


    return (
        <OrdersContext.Provider value={{orders, setOrder, orderDate, setOrderDate}}>
            {props.children}
        </OrdersContext.Provider>
    );
}


*/




