import React, { useContext } from 'react';
import { CustDateRecentContext } from '../../dataContexts/CustDateRecentContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';

export const Customers = () => {

    const { customers } = useContext(CustomerContext);
    const { setChosen } = useContext(CustDateRecentContext)

    const handleChange = e => {
        setChosen(e.target.value);
      }
    
    customers.sort(function(a,b){return a[2]>b[2] ? 1 : -1;})

    return (
        <React.Fragment>
        <label>Customers:</label>
        <select id = "customers" name="customers" onChange={handleChange}>
            {customers ? customers.map(customer => 
                <option key = {customer[2]} value={customer[2]}>{customer[2]}</option>
            ):''}
        </select>
        </React.Fragment>
    );
};


