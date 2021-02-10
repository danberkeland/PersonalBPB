import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex, addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch } from '../helpers/useFetch'

require('dotenv').config()

export const CustomerContext = createContext();


export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);
    const [ routeIsOn, setRouteIsOn ] =useState(false)
    
    return (
        <CustomerContext.Provider value={{ customers, setCustomer, routeIsOn, setRouteIsOn }}>
            {props.children}
        </CustomerContext.Provider>
    );   
    
};



export const CustomerLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_CUSTOMERS,[]);

    const { setCustomer } = useContext(CustomerContext)

    useEffect(() => {
        if(data){
            sortAtoZDataByIndex(data,2)
            let newData = addAnEmptyRowToTop(data)
            setCustomer(newData);
        }
    },[data, setCustomer]);


    return (
        <React.Fragment>
            { loading && <p> Updating Customer Info ...</p>}
            { error && <p> error while loading customers!</p>}
        </React.Fragment>
    )
    
};

