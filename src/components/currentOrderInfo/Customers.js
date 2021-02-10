import React, { useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';

import { FindNewRoute } from '../../helpers/sortDataHelpers'
import { tomorrow } from '../../helpers/dateTimeHelpers'
import { createRetailOrderCustomers } from '../../helpers/sortDataHelpers'
import { ToggleContext } from '../../dataContexts/ToggleContext';


export const Customers = () => {

    const { customers, setRouteIsOn } = useContext(CustomerContext);
    const { orders } = useContext(OrdersContext)
    const { chosen, setRoute, setChosen, delivDate, setDelivDate } = useContext(CurrentDataContext)
    const { orderTypeWhole } = useContext(ToggleContext)

    const [ customerGroup, setCustomerGroup ] = useState(customers)

    

    useEffect(() => {
        orderTypeWhole ? setCustomerGroup(customers) : setCustomerGroup(createRetailOrderCustomers(orders))
    },[ customers, orderTypeWhole, orders ])


    useEffect(() => {
        let newRoute = FindNewRoute(chosen, delivDate, orders, customers)
        setRoute(newRoute)      
    },[chosen, delivDate, customers, setRoute, orders])
    

    
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


