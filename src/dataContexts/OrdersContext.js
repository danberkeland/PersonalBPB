import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch, FilterOrdersDups, handleLoadingError } from '../helpers/useFetch'


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

    const { data } = useFetch(process.env.REACT_APP_API_ORDERS, []);

    

    useEffect(() => { 
        if(data){
            if(data.length>0){
                let currentData = FilterOrdersDups(data)
                setOrders(currentData);
                setOriginalOrders(currentData);
                setOrdersLoaded(true)
            }
        } else {
            handleLoadingError()
        }
    },[data]);

    

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

