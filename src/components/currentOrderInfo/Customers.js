import React, { useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CustDateRecentContext } from '../../dataContexts/CustDateRecentContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';

import { tomorrow } from '../../helpers/dateTimeHelpers'

export const Customers = () => {

    const { customers, 
            wholeCustomers, 
            setWholeCustomers, 
            specialCustomers, 
            setSpecialCustomers,
         } = useContext(CustomerContext);

    const { chosen, setChosen, setDelivDate, orderTypeWhole } = useContext(CustDateRecentContext)
    const { orders } = useContext(OrdersContext)


    useEffect(() => {
            let special = orders.filter(order => order[3] === "9999")
            special = special.map(order => ["","9999",order[8],order[6]])
            let unique = special.map(ar => JSON.stringify(ar))
                .filter((itm, idx, arr) => arr.indexOf(itm) === idx)
                .map(str => JSON.parse(str))
            if (unique[0] !== ['','','','']){
                unique.unshift(['','','',''])
            }
            setSpecialCustomers(unique)
        }, [orders, setSpecialCustomers]);
    

    useEffect(() => {
            customers.sort(function(a,b){return a[2]>b[2] ? 1 : -1;})
            if (customers[0] !== ['','','','']){
                customers.unshift(['','','',''])
            }
            setWholeCustomers(customers)  
        },[customers, setWholeCustomers]);
    

    const handleChange = e => {
        setChosen(e.target.value);
        setDelivDate(tomorrow())
        }
   

    return (
        <React.Fragment>
        <label>Customers:</label>
        <select id = "customers" name="customers" value={chosen} onChange={handleChange}>
            {orderTypeWhole ? 
                wholeCustomers ? wholeCustomers.map((customer) => 
                    <option key = {uuidv4()} 
                            value={customer[2]}>
                                {customer[2]}
                    </option>
                ) : '' : specialCustomers.map((customer) => 
                    <option key = {uuidv4()} value={customer[2]}>{customer[2]}</option>
                )}
        </select>
        </React.Fragment>
    );
};


