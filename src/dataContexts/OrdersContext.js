import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch, FilterOrdersDups } from '../helpers/useFetch'

import { ProgressSpinner } from 'primereact/progressspinner';

require('dotenv').config()

export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const [orders, setOrders] = useState([]);
    const [ recentOrders, setRecentOrders ] = useState([]);
    const [ originalOrders, setOriginalOrders ] = useState([]);
 
    return (
        <OrdersContext.Provider value={{ 
            orders, setOrders, 
            recentOrders, setRecentOrders,
            originalOrders, setOriginalOrders
            }}>

            {props.children}

        </OrdersContext.Provider>
    );   
    
};



export const OrdersLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_ORDERS, []);

    const { setOrders, setOriginalOrders } = useContext(OrdersContext)

    useEffect(() => {
        if(data.length>0){
            let currentData = FilterOrdersDups(data)
            setOrders(currentData);
            setOriginalOrders(currentData);
        }
    },[data, setOrders, setOriginalOrders]);

    return (
        <React.Fragment>
            { loading && <div className = "Loader"><div className = "loaderBack"><ProgressSpinner/></div></div>}
            { error && <p> error while Loading Orders!</p>}
        </React.Fragment>
    )
    
};

