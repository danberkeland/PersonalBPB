import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch, FilterOrdersDups } from '../helpers/useFetch'

import { ProgressSpinner } from 'primereact/progressspinner';

require('dotenv').config()

export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const [orders, setOrders] = useState([]);
    const [ recentOrders, setRecentOrders ] = useState([]);
    const [ originalOrders, setOriginalOrders ] = useState([]);
    const [ ordersLoaded, setOrdersLoaded ] = useState(true)
 
    return (
        <OrdersContext.Provider value={{ 
            orders, setOrders, 
            recentOrders, setRecentOrders,
            originalOrders, setOriginalOrders,
            ordersLoaded, setOrdersLoaded
            }}>

            {props.children}

        </OrdersContext.Provider>
    );   
    
};



export const OrdersLoad = () => {

    const { loading, data } = useFetch(process.env.REACT_APP_API_ORDERS, []);

    const { setOrders, setOriginalOrders, setOrdersLoaded } = useContext(OrdersContext)

    useEffect(() => {
        if(data.length>0){
            let currentData = FilterOrdersDups(data)
            setOrders(currentData);
            setOriginalOrders(currentData);
        }
    },[data, setOrders, setOriginalOrders]);

    useEffect(() => {
        setOrdersLoaded(!loading)
    },[loading, setOrdersLoaded])

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

