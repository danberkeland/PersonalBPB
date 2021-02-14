import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex, addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch, FilterDupsByIndex } from '../helpers/useFetch'


require('dotenv').config()

export const CustomerContext = createContext();


export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);
    const [ custLoaded, setCustLoaded ] = useState(false)
    
    return (
        <CustomerContext.Provider value={{ customers, setCustomer, custLoaded, setCustLoaded }}>
            {props.children}
        </CustomerContext.Provider>
    );   
    
};



export const CustomerLoad = () => {

    const { setCustomer, setCustLoaded } = useContext(CustomerContext)

    
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
    },[loading, setCustLoaded])

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

