import { useContext } from 'react';

import { OrdersContext } from '../dataContexts/OrdersContext';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { StandingContext } from '../dataContexts/StandingContext';

export const CreateCalendarEvents = () => {

    const [orders, setOrder, orderDate, setOrderDate] = useContext(OrdersContext);
    const [customers, setCustomer, chosen, setChosen] = useContext(CustomerContext);
    const [standing, setStanding] = useContext(StandingContext)
    


    let standingArray = standing ? standing.filter(order => order[8] === chosen) : [];
    standingArray = standingArray.map(order => Number(order[0])-1)
    let uniqueStanding = new Set(standingArray);
    let backToStandingArray = [...uniqueStanding]

    let cartDateArray = orders ? orders.filter(order => order[8] === chosen) : [];
    cartDateArray = cartDateArray.map(order => order[0])
    let uniqueCart = new Set(cartDateArray);
    let backToCartArray = [...uniqueCart]
    
    let cartDateBlankArray = orders ? orders.filter(order => order[8] === chosen) : [];
    cartDateBlankArray = cartDateBlankArray.map(order => ({'ddate':order[0], 'qqty': Number(order[2])}));
    let holder = {}
    cartDateBlankArray.forEach(d => holder.hasOwnProperty(d.ddate) ? holder[d.ddate] = holder[d.ddate] + d.qqty :
        holder[d.ddate] = d.qqty);

    

    let obj2 = [];
    for (var prop in holder) {
        let i = prop.split('/')
        let prop2 = i[2]+"-"+i[0]+"-"+i[1]
        obj2.push([prop2,holder[prop]])

    obj2 = obj2.filter(ob3 => ob3[1] === 0)
    }

    obj2 = obj2.map(ob4 => ob4[0])
    



    
    let standingEvents = {title: '',
                        daysOfWeek: backToStandingArray,
                        display: 'background'}


    let calendarEvents = [{title: '',
                        date: orderDate,
                        display: 'background'}]

    calendarEvents.push(standingEvents)
    for (let order of backToCartArray) {
        let newEvent = {title: '',
                    date: order[0],
                    display: 'background'}
        calendarEvents.push(newEvent)
    }
    for (let order of obj2) {
        let newEvent2 = {title: '',
                    date: order,
                    display: 'inverse-background'}
        calendarEvents.push(newEvent2)
    }
    
    return calendarEvents
}