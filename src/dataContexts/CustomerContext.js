import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch } from '../helpers/useFetch'

import { ToggleContext } from './ToggleContext';


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
    const { setIsLoading } = useContext(ToggleContext)

    
    let { data } = useFetch(process.env.REACT_APP_API_GETOBJCUSTOMER,[]);


    useEffect(() => { 
        setIsLoading(true) 
        if(data){
            if(data.length>0){
                setCustomer(data);
                setCustLoaded(true)
                setIsLoading(false)
            }
        }
    },[data]);
    
  

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

