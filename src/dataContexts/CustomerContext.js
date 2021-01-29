import React, { useState, createContext, useContext, useEffect } from 'react';

require('dotenv').config()

export const CustomerContext = createContext();


export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);
    const [routes, setRoutes ] = useState(['Pick Up SLO','Pick up Carlton']);
    const [route, setRoute ] = useState()

    return (
        <CustomerContext.Provider value={{ customers, setCustomer, routes, setRoutes, route, setRoute }}>
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
        data.sort(function(a,b){return a[2]>b[2] ? 1 : -1;})
        setCustomer(data);
    },[data, setCustomer]);

    return (
        <React.Fragment>
            { loading && <p>Loading Customers ...</p>}
            { error && <p> error while loading customers!</p>}
        </React.Fragment>
    )
    
};

