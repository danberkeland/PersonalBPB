import React, { useContext, useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';

import { createRouteList, FindNewRoute } from '../../helpers/sortDataHelpers'



const Routes = () => {

    const { customers } = useContext(CustomerContext)
    const { thisOrder } = useContext(OrdersContext)
    const { chosen, delivDate, route, setRoute } = useContext(CurrentDataContext)

    const [ routes, setRoutes ] = useState()
    
    
    useEffect(()=> {
        let routeList = createRouteList(customers)
        setRoutes(routeList)
    },[customers, setRoutes])


    
    useEffect(() => {
        let newRoute = FindNewRoute(chosen, delivDate, thisOrder, customers)
        setRoute(newRoute)      
    },[chosen, delivDate, customers, setRoute, thisOrder])
    


    const handleChange = e => {
        setRoute(e.target.value);
        }

    return (
        <React.Fragment>
            <label>Routes:</label>
            <select id="routes" name="routes" value={route} onChange={handleChange}>
            {routes ? routes.map(ro =>  <option id="routes" key={uuidv4()} name={ro}>{ro}</option>) : ''}
            </select>
        </React.Fragment>
    );
};

export default Routes