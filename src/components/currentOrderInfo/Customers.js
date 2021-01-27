import React, { useContext } from 'react';
import { CustomerContext } from '../../dataContexts/CustomerContext';

export const Customers = () => {

    const { customers } = useContext(CustomerContext);
    
    customers.sort(function(a,b){return a[2]>b[2] ? 1 : -1;})

    return (
        <React.Fragment>
        <label>Customers:</label>
        <select id = "customers" name="customers">
            {customers ? customers.map(customer => 
                <option key = {customer[2]} value={customer[2]}>{customer[2]}</option>
            ):''}
        </select>
        </React.Fragment>
    );
};


