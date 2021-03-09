import React, { useState, createContext, useContext, useEffect } from 'react';

import { FilterOrdersDups } from '../helpers/useFetch'

import { listOrders } from '../graphql/queries'

import { API, graphqlOperation } from 'aws-amplify';


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

    useEffect(() => {
        fetchOrders()
    },[])



    const fetchOrders = async () => {
        try{
          const ordData = await API.graphql(graphqlOperation(listOrders, {
                limit: '5000'
                }))
          const ordList = ordData.data.listOrders.items;
          let noDelete = ordList.filter(cust => cust["_deleted"]!==true)
          let currentData = FilterOrdersDups(noDelete)
          setOrders(currentData)
          setOrdersLoaded(true)
          setOriginalOrders(currentData);
        } catch (error){
          console.log('error on fetching Cust List', error)
        }
      }
  








    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

