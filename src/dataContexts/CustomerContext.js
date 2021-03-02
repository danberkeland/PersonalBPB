import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch, handleLoadingError } from '../helpers/useFetch'


require('dotenv').config()

export const CustomerContext = createContext();


export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);
    const [ custLoaded, setCustLoaded ] = useState(false)
    
    
    return (
        <CustomerContext.Provider value={{ 
            customers, setCustomer, 
            custLoaded, setCustLoaded
            }}>
            {props.children}
        </CustomerContext.Provider>
    );   
    
};


export const CustomerLoad = () => {

    const { setCustomer, setCustLoaded } = useContext(CustomerContext)

    
    let { data } = useFetch(process.env.REACT_APP_API_GETOBJCUSTOMER,[]);


    useEffect(() => { 
        if(data){
            if(data.length>0){
                setCustomer(data);
                setCustLoaded(true)
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

