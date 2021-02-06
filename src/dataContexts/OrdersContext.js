import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex, convertSheetsOrdersToAppOrders } from '../helpers/sortDataHelpers'
import { useFetch } from '../helpers/useFetch'

require('dotenv').config()

export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const [orders, setOrders] = useState([]);
    const [ recentOrders, setRecentOrders ] = useState([]);
    const [ originalOrders, setOriginalOrders ] = useState([]);
    const [ cartList, setCartList ] = useState(true)
 
    return (
        <OrdersContext.Provider value={{ 
            orders, setOrders, 
            recentOrders, setRecentOrders,
            originalOrders, setOriginalOrders,
            cartList, setCartList
            }}>

            {props.children}

        </OrdersContext.Provider>
    );   
    
};



export const OrdersLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_ORDERS, []);

    const { setOrders, setOriginalOrders } = useContext(OrdersContext)

    useEffect(() => {
        if(data){
            sortAtoZDataByIndex(data,0)
            let appOrders = convertSheetsOrdersToAppOrders(data)
            setOrders(appOrders);
            setOriginalOrders(appOrders);
        }
    },[data, setOrders, setOriginalOrders]);

    return (
        <React.Fragment>
            { loading && <p>Loading Orders ...</p>}
            { error && <p> error while Loading Orders!</p>}
        </React.Fragment>
    )
    
};

