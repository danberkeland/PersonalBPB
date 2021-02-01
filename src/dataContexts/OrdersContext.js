import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'

require('dotenv').config()

export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const [orders, setOrders] = useState([]);
    const [ thisOrder, setThisOrder ] = useState([]);
    const [ ponote, setPonote ] = useState('na')
    const [ recentOrders, setRecentOrders ] = useState([]);
    const [ thisOrderHasBeenChanged, setThisOrderHasBeenChanged ] = useState(false);
 
    return (
        <OrdersContext.Provider value={{ 
            orders, setOrders, 
            thisOrder, setThisOrder, 
            ponote, setPonote,
            recentOrders, setRecentOrders,
            thisOrderHasBeenChanged, setThisOrderHasBeenChanged

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
        sortAtoZDataByIndex(data,0)
        setOrders(data);
    },[data, setOrders]);

    return (
        <React.Fragment>
            { loading && <p>Loading Orders ...</p>}
            { error && <p> error while Loading Orders!</p>}
        </React.Fragment>
    )
    
};

