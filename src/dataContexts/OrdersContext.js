import React, { useState, createContext, useContext, useEffect } from 'react';

require('dotenv').config()

export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const [orders, setOrders] = useState([]);
    const [ thisOrder, setThisOrder ] = useState([]);
    const [ ponotes, setPonotes ] = useState('na')
    const [ recentOrders, setRecentOrders ] = useState([]);
 
    return (
        <OrdersContext.Provider value={{ 
            orders, setOrders, 
            thisOrder, setThisOrder, 
            ponotes, setPonotes,
            recentOrders, setRecentOrders 
            }}>

            {props.children}

        </OrdersContext.Provider>
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




export const OrdersLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_ORDERS, []);

    const { setOrders } = useContext(OrdersContext)

    useEffect(() => {
        data.sort(function(a,b){return a[0]>b[0] ? 1 : -1;})
        setOrders(data);
    },[data, setOrders]);

    return (
        <React.Fragment>
            { loading && <p>Loading Orders ...</p>}
            { error && <p> error while Loading Orders!</p>}
        </React.Fragment>
    )
    
};

