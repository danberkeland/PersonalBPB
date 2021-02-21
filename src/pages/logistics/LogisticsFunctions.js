import React, { useContext, useEffect } from 'react';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { ProductsContext } from '../../dataContexts/ProductsContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';
import { HoldingContext } from '../../dataContexts/HoldingContext';
import { RoutesContext } from '../../dataContexts/RoutesContext';
import { ToggleContext } from '../../dataContexts/ToggleContext';

import { createRouteList } from '../../helpers/sortDataHelpers'



const LogisticsFunctions = () => {

    const { customers, setCustLoaded } = useContext(CustomerContext)
    const { products, setProdLoaded } = useContext(ProductsContext)
    const { setRoutes } = useContext(RoutesContext)
    const { orders, setOrdersLoaded } = useContext(OrdersContext)
    const { standing, setStandLoaded } = useContext(StandingContext)
    const { chosen, delivDate, setCalendarEvents } = useContext(CurrentDataContext)
    const { setRouteIsOn } = useContext(ToggleContext)
   


    //  T O G G L E S 

    // when a customer is chosen, route and ponote are turned on

    useEffect(() => {
        if (orders.length<1){
            setOrdersLoaded(false)
        }
    },[])

    useEffect(() => {
        if (customers.length<1){
            setCustLoaded(false)
        }
    },[])

    useEffect(() => {
        if (products.length<1){
            setProdLoaded(false)
        }
    },[])

    useEffect(() => {
        if (standing.length<1){
            setStandLoaded(false)
        }
    },[])


    setRouteIsOn(true)




    //  F U N C T I O N S
    
    // Create a new route list if customers changes
    useEffect(()=> {
        let routeList = createRouteList(customers)
        setRoutes(routeList)
    },[customers, setRoutes])

    

    useEffect(() => {
       
        let calendarEvents = [{title: '',
                            date: delivDate,
                            display: 'background'}]


        setCalendarEvents(calendarEvents)
    },[chosen, delivDate, orders, standing, setCalendarEvents])
    

    return (
        <React.Fragment>         
        </React.Fragment>
    );
};

export default LogisticsFunctions