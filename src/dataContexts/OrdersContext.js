import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch, FilterOrdersDups } from '../helpers/useFetch'

import { ToggleContext } from './ToggleContext';

require('dotenv').config()

export const OrdersContext = createContext();


export const OrdersProvider = (props) => {
    
    const [orders, setOrders] = useState([]);
    const [ recentOrders, setRecentOrders ] = useState([]);
    const [ originalOrders, setOriginalOrders ] = useState([]);
    const [ ordersLoaded, setOrdersLoaded ] = useState(false)
 
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

    const { setOrders, setOriginalOrders, setOrdersLoaded } = useContext(OrdersContext)
    const { setIsLoading } = useContext(ToggleContext)

    const { data } = useFetch(process.env.REACT_APP_API_ORDERS, []);

    

    useEffect(() => { 
        setIsLoading(true) 
        if(data){
            if(data.length>0){
                let currentData = FilterOrdersDups(data)
                setOrders(currentData);
                setOriginalOrders(currentData);
                setOrdersLoaded(true)
                setIsLoading(false)
            }
        }
    },[data]);

    

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

