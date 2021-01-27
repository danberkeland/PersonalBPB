import React, { useState, useEffect, useContext } from 'react';
import { CustomerContext } from '../../dataContexts/CustomerContext';

require('dotenv').config()

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

const Loading = () => (
    <React.Fragment>
        <label>Customer:</label>
        <label>Loading ...</label>
    </React.Fragment>
)

const Error = () => (
    <React.Fragment>
        <label>Customer:</label>
    </React.Fragment>
)

const List = ({ items }) => {

    const { customers, setCustomer } = useContext(CustomerContext)

    useEffect(() => {
        setCustomer(items);
    });

    return(
    <React.Fragment>
        <label id="test">Customer:</label>
        <select id="customers" name="customers">
          {customers.map(item => 
            <option key={item[2]} value={item[2]}>{item[2]}</option> 
          )}
        </select>
      </React.Fragment>
    )
}



export const CurrentOrderInfoCustomer = () => {

    console.log(process.env.API_CUSTOMERS)
    const { loading, error, data } = useFetch(process.env.REACT_APP_API_CUSTOMERS);
    
    return (
        <React.Fragment>
            { loading && <Loading /> }
            { error && <Error /> }
            { data? data.length>0 ? <List items={data.sort(function(a,b){return a[2]>b[2] ? 1 : -1;})} /> : '' : '' }
        </React.Fragment>
    );
};


