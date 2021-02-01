import React, { useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CurrentOrderContext } from '../../dataContexts/CurrentOrderContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';

const Routes = () => {

    const { customers } = useContext(CustomerContext)
    const { thisOrder } = useContext(OrdersContext)
    const { chosen, delivDate, route, setRoute } = useContext(CurrentOrderContext)
    
    useEffect(()=> {
        let custArray = [...customers]
        custArray = custArray.map(cust => cust[3])
        const uniqueCustArray = new Set(custArray)
        const newCustArray = Array.from(uniqueCustArray)
        setRoutes(newCustArray)
    },[customers, setRoutes])

    useEffect(() => {
        let ro
        let newRoute
        let currentRoutes = thisOrder.filter(order => order[2] === chosen );
        let custRoute = customers.find(element => element[2] === chosen)
        custRoute ? newRoute = custRoute[3] : newRoute = []
        if (currentRoutes.length>0) {
            ro = currentRoutes[0][4]
            setRoute(ro)
        }
        if (newRoute !== []){
            setRoute(newRoute)
        }
        
    },[chosen, delivDate, customers, setRoute, thisOrder])

    const handleChange = e => {
        setRoute(e.target.value);
        }

    return (
        <React.Fragment>
            <label>Routes:</label>
            <select id="routes" name="routes" value={route} onChange={handleChange}>
            {routes.map(ro =>  <option id="routes" key={uuidv4()} name={ro}>{ro}</option>)}
            </select>
        </React.Fragment>
    );
};

export default Routes