import React, { useContext } from 'react';

import { OrdersContext } from '../dataContexts/OrdersContext';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { StandingContext } from '../dataContexts/StandingContext';

import { convertDatetoBPBDate, convertDatetoStandingDate } from '../helpers/dateTimeHelpers';

export const CreateCalendarEvents = () => {

    const [orders, setOrder, orderDate, setOrderDate] = useContext(OrdersContext);
    const [customers, setCustomer, chosen, setChosen] = useContext(CustomerContext);
    const [standing, setStanding] = useContext(StandingContext)
    
    let standingArray = [1,3,5]
    let cartDates = ['2021-01-24', '2021-01-26']
    let cartDateBlanks = ['2021-01-25']

    let standingEvents = {title: '',
                        daysOfWeek: standingArray,
                        display: 'background'}


    let calendarEvents = [{title: '',
                        date: orderDate,
                        display: 'background'}]
                        
    calendarEvents.push(standingEvents)
    for (let order of cartDates) {
        let newEvent = {title: '',
                    date: order,
                    display: 'background'}
        calendarEvents.push(newEvent)
    }
    for (let order of cartDateBlanks) {
        let newEvent = {title: '',
                    date: order,
                    display: 'inverse-background'}
        calendarEvents.push(newEvent)
    }
    

        
    
                        


    return calendarEvents
    
}