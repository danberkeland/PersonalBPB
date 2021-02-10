import React, { useContext, useEffect } from 'react';

import { CurrentDataContext } from '../dataContexts/CurrentDataContext';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { StandingContext } from '../dataContexts/StandingContext';
import { RoutesContext } from '../dataContexts/RoutesContext';
import { ToggleContext } from '../dataContexts/ToggleContext';

import { createRouteList, findCurrentPonote, findNewRoute } from '../helpers/sortDataHelpers'


const OrderingFunctions = () => {

    const { customers } = useContext(CustomerContext)
    const { setRoutes } = useContext(RoutesContext)
    const { orders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { chosen, setRoute, delivDate, setPonote } = useContext(CurrentDataContext)
    const { setRouteIsOn, setPONoteIsOn } = useContext(ToggleContext)
   

    // Create a new route list if customers changes
    useEffect(()=> {
        let routeList = createRouteList(customers)
        setRoutes(routeList)
    },[customers, setRoutes])


    // Find new current route based on customer, date, standing, orders, or customers change
    useEffect(() => {
        let newRoute = findNewRoute(chosen, delivDate, standing, orders, customers)
        setRoute(newRoute)      
    },[chosen, delivDate, customers, standing, setRoute, orders])


    // when a customer is chosen, route and ponote are turned on
    useEffect(() => {
        chosen && setRouteIsOn(true)
        chosen && setPONoteIsOn(true)
    },[chosen, setRouteIsOn, setPONoteIsOn])


    // find new current PO Note when customer, delivDate, or orders are changed
    useEffect(() => {
        let po = findCurrentPonote(chosen, delivDate, orders)
        document.getElementById('PONotes').value = '';
        setPonote(po)

    },[chosen, delivDate, setPonote, orders])


    return (
        <React.Fragment>         
        </React.Fragment>
    );
};

export default OrderingFunctions