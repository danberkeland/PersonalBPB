import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex, addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch, FilterDupsByIndex } from '../helpers/useFetch'

import { ProgressSpinner } from 'primereact/progressspinner';

require('dotenv').config()

export const CustomerContext = createContext();


export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);
    
    return (
        <CustomerContext.Provider value={{ customers, setCustomer }}>
            {props.children}
        </CustomerContext.Provider>
    );   
    
};



export const CustomerLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_CUSTOMERS,[]);

    const { setCustomer } = useContext(CustomerContext)

    useEffect(() => {
        if(data){

            let currentData = FilterDupsByIndex(data,2)
            sortAtoZDataByIndex(currentData,2)
            let newData = addAnEmptyRowToTop(currentData)
            setCustomer(newData);
        }
    },[data, setCustomer]);


    return (
        <React.Fragment>
            { loading && <div className = "Loader"><ProgressSpinner/></div>}
            { error && <p> error while loading customers!</p>}
        </React.Fragment>
    )
    
};

