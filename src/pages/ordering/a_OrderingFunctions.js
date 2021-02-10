import React, { useContext, useEffect } from 'react';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';
import { RoutesContext } from '../../dataContexts/RoutesContext';
import { ToggleContext } from '../../dataContexts/ToggleContext';

import { createRouteList, findCurrentPonote, findNewRoute } from '../../helpers/sortDataHelpers'


const OrderingFunctions = () => {

    const { customers } = useContext(CustomerContext)
    const { setRoutes } = useContext(RoutesContext)
    const { orders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { chosen, setRoute, delivDate, setPonote, currentCartList } = useContext(CurrentDataContext)
    const { setRouteIsOn, setPONoteIsOn } = useContext(ToggleContext)
   

    // T O G G L E S 

    // when a customer is chosen, route and ponote are turned on
    useEffect(() => {
        chosen && setRouteIsOn(true)
        chosen && setPONoteIsOn(true)
    },[chosen, setRouteIsOn, setPONoteIsOn])


    // Turn PO Note Off and ON based on currentEntryList
    useEffect(() => {
        currentCartList.length<1 && setPONoteIsOn(false)
        currentCartList.length>0 && setPONoteIsOn(true)
    },[currentCartList, setPONoteIsOn])




    // F U N C T I O N S
    
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