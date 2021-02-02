import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'
import { useFetch } from '../helpers/useFetch'

require('dotenv').config()

export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const [orders, setOrders] = useState([]);
    const [ recentOrders, setRecentOrders ] = useState([]);
 
    return (
        <OrdersContext.Provider value={{ 
            orders, setOrders, 
            recentOrders, setRecentOrders
            }}>

            {props.children}

        </OrdersContext.Provider>
    );   
    
};



export const OrdersLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_ORDERS, []);

    const { setOrders } = useContext(OrdersContext)

    useEffect(() => {
        if(data){
            sortAtoZDataByIndex(data,0)
            setOrders(data);
            setOrders(data)
        }
    },[data, setOrders, setOrders]);

    return (
        <React.Fragment>
            { loading && <p>Loading Orders ...</p>}
            { error && <p> error while Loading Orders!</p>}
        </React.Fragment>
    )
    
};

