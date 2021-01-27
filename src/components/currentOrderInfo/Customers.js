import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CustDateRecentContext } from '../../dataContexts/CustDateRecentContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';

import { tomorrow } from '../../helpers/dateTimeHelpers'

export const Customers = () => {

    const { customers } = useContext(CustomerContext);
    const { setChosen, setDelivDate, orderType } = useContext(CustDateRecentContext)
    const { orders } = useContext(OrdersContext)

    const handleChange = e => {
        setChosen(e.target.value);
        setDelivDate(tomorrow())
      }
    
    customers.sort(function(a,b){return a[2]>b[2] ? 1 : -1;})

    let special = orders.filter(order => order[3] === "9999")
    special = special.map(order => ["","9999",order[8],order[6]])

    return (
        <React.Fragment>
        <label>Customers:</label>
        <select id = "customers" name="customers" onChange={handleChange}>
            {orderType ? 
                customers.map((customer) => 
                    <option key = {uuidv4()} value={customer[2]}>{customer[2]}</option>
                ) : special.map((customer) => 
                    <option key = {uuidv4()} value={customer[2]}>{customer[2]}</option>
                )}
        </select>
        </React.Fragment>
    );
};


