import React, { useContext, useEffect } from 'react';
import { CustDateRecentContext } from '../../dataContexts/CustDateRecentContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';

const Routes = () => {

    const { customers, routes, setRoutes, route, setRoute } = useContext(CustomerContext)
    const { thisOrder, setPonotes } = useContext(OrdersContext)
    const { chosen, delivDate } = useContext(CustDateRecentContext)
    
    useEffect(()=> {
        let custArray = [...customers]
        custArray = custArray.map(cust => cust[3])
        const uniqueCustArray = new Set(custArray)
        const newCustArray = Array.from(uniqueCustArray)
        setRoutes(newCustArray)
    },[customers, setRoutes])

    useEffect(() => {
        let ro
        let currentRoutes = thisOrder.filter(order => order[2] === chosen );
        let custRoute = customers.find(element => element[2] === chosen)
        let newRoute = custRoute[3]
        if (currentRoutes.length>0) {
            ro = currentRoutes[0][4]
        } else {
            ro = newRoute
        }
        setRoute(ro)

    },[chosen, delivDate, customers, setPonotes, setRoute, thisOrder])


    return (
        <React.Fragment>
            <label>Routes:</label>
            <select id="routes" name="routes" value={route}>
            {routes.map(ro =>  <option id="routes" name={ro}>{ro}</option>)}
            </select>
        </React.Fragment>
    );
};

export default Routes