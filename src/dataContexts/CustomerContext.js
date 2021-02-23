import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex, addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch, FilterDupsByIndex } from '../helpers/useFetch'


require('dotenv').config()

export const CustomerContext = createContext();


export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);
    const [ custLoaded, setCustLoaded ] = useState(true)
    const [ fullCustomer, setFullCustomer ] = useState([])
    const [ fullCustLoaded, setFullCustLoaded ] = useState(true)
    
    return (
        <CustomerContext.Provider value={{ 
            customers, setCustomer, 
            custLoaded, setCustLoaded, 
            fullCustomer, setFullCustomer,
            fullCustLoaded, setFullCustLoaded 
            }}>
            {props.children}
        </CustomerContext.Provider>
    );   
    
};



export const CustomerLoad = () => {

    const { setCustomer, setCustLoaded, setFullCustLoaded } = useContext(CustomerContext)

    
    let { loading, data } = useFetch(process.env.REACT_APP_API_CUSTOMERS,[]);
    
    useEffect(() => {
        if(data){

            let currentData = FilterDupsByIndex(data,2)
            sortAtoZDataByIndex(currentData,2)
            let newData = addAnEmptyRowToTop(currentData)
            setCustomer(newData);
        }
    },[data, setCustomer]);

    useEffect(() => {
        setCustLoaded(!loading)
        setFullCustLoaded(!loading)
    },[loading, setFullCustLoaded, setCustLoaded])

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};


export const FullCustomerLoad = () => {

    const { setFullCustomer, setFullCustLoaded } = useContext(CustomerContext)

    
    let { loading, data } = useFetch(process.env.REACT_APP_API_GETOBJCUSTOMER,[]);
    
    useEffect(() => {
        if(data){
            setFullCustomer(data);
        }
    },[data, setFullCustomer]);

    useEffect(() => {
        setFullCustLoaded(!loading)
    },[loading, setFullCustLoaded])

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

