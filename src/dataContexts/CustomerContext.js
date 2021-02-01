import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'


require('dotenv').config()

export const CustomerContext = createContext();


export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);
    const [routes, setRoutes ] = useState(['Pick Up SLO','Pick up Carlton']);
    const [route, setRoute ] = useState()
    const [wholeCustomers, setWholeCustomers] = useState();
    const [retailCustomers, setRetailCustomers] = useState();

    return (
        <CustomerContext.Provider value={{ 
            customers, setCustomer, 
            wholeCustomers, setWholeCustomers,
            retailCustomers, setRetailCustomers,
            routes, setRoutes, 
            route, setRoute 
            }}>
            {props.children}
        </CustomerContext.Provider>
    );   
    
};


const useFetch = url => {
    const [state, setState] = useState({
        loading: true,
        error: false,
        data: [],
    });

    useEffect(() => {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then(data => setState({loading: false, error: false, data: data.body }))
            .catch(error => setState({ loading: false, error, data: [] }));
    }, [url]);

    return state;
};


export const CustomerLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_CUSTOMERS,[]);

    const { setCustomer } = useContext(CustomerContext)

    useEffect(() => {
        sortAtoZDataByIndex(data,2)
        setCustomer(data);
    },[data, setCustomer]);


    return (
        <React.Fragment>
            { loading && <p> Updating Customer Info ...</p>}
            { error && <p> error while loading customers!</p>}
        </React.Fragment>
    )
    
};

