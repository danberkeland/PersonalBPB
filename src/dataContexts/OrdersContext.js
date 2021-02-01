import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'
import { useFetch } from '../helpers/useFetch'

require('dotenv').config()

export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const [orders, setOrders] = useState([]);
    const [ thisOrder, setThisOrder ] = useState([]);
    const [ recentOrders, setRecentOrders ] = useState([]);
 
    return (
        <OrdersContext.Provider value={{ 
            orders, setOrders, 
            thisOrder, setThisOrder, 
            recentOrders, setRecentOrders,
            }}>

            {props.children}

        </OrdersContext.Provider>
    );   
    
};



export const OrdersLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_ORDERS, []);

    const { setOrders, setThisOrder } = useContext(OrdersContext)

    useEffect(() => {
        if(data){
            sortAtoZDataByIndex(data,0)
            setOrders(data);
            setThisOrder(data)
        }
    },[data, setThisOrder, setOrders]);

    return (
        <React.Fragment>
            { loading && <p>Loading Orders ...</p>}
            { error && <p> error while Loading Orders!</p>}
        </React.Fragment>
    )
    
};

