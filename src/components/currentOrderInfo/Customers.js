import React, { useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';

import { tomorrow } from '../../helpers/dateTimeHelpers'
import { createRetailOrderCustomers } from '../../helpers/sortDataHelpers'


export const Customers = () => {

    const { customers, setRouteIsOn } = useContext(CustomerContext);
    const { orders } = useContext(OrdersContext)
    const { chosen, setChosen, setDelivDate, orderTypeWhole, setModifications } = useContext(CurrentDataContext)

    const [ customerGroup, setCustomerGroup ] = useState(customers)

    

    useEffect(() => {
        orderTypeWhole ? setCustomerGroup(customers) : setCustomerGroup(createRetailOrderCustomers(orders))
    },[ customers, orderTypeWhole, orders ])

    
    const handleChange = e => {
        setChosen(e.target.value);
        setRouteIsOn(true)
        setDelivDate(tomorrow())
        }

    return (
        <React.Fragment>
        <label>Customers:</label>
        <select id = "customers" name="customers" value={chosen} onChange={handleChange}>
            {customerGroup ? customerGroup.map((customer) => 
                    <option key = {uuidv4()} 
                            value={customer[2]}>
                                {customer[2]}
                    </option>
            ) : ''};
        </select>
        </React.Fragment>
    );
};


