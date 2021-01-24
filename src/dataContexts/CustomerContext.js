
import React, { useState, createContext, useEffect } from 'react';


export const CustomerContext = createContext();


export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);
    const [chosen, setChosen] = useState('');

    useEffect(() => {
        const apiUrl = "https://y3uhetle25.execute-api.us-east-2.amazonaws.com/test";
        fetch(apiUrl)
        .then(res => res.json())
        .then(data => setCustomer(data.body.sort(function(a,b){return a[2]>b[2] ? 1 : -1;})));
        
    },[])

    return (
        <CustomerContext.Provider value={[customers, setCustomer, chosen, setChosen]}>
            {props.children}
        </CustomerContext.Provider>
    );   
    
};