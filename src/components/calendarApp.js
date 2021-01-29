import React,{ useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';
import { StandingContext } from "../dataContexts/StandingContext";
import { OrdersContext } from "../dataContexts/OrdersContext";



export const ChangeBPBDatetoJSDate = (date) => {
    let BPBDateParts = date.split('/')
    let JSDate = BPBDateParts[2]+"-"+BPBDateParts[0]+"-"+BPBDateParts[1]
    return JSDate;
}


export const CreateStandingArray = (standing, chosen) => {

    if (!standing) {
        alert("No Standing Order Loaded ...")
        return "No Standing Order Loaded ..."
    }

    let standingArray = standing ? standing.filter(order => order[8] === chosen) : [];
    standingArray = standingArray.map(order => Number(order[0])-1)
    let uniqueStanding = new Set(standingArray);
    return [...uniqueStanding]
}


export const CreateCartDateArray = (orders, chosen) => {

    if (!orders) {
        alert("No Orders Loaded ...")
        return "No Orders Loaded ..."
    }

    let cartDateArray = orders ? orders.filter(order => order[8] === chosen) : [];
    cartDateArray = cartDateArray.map(order => ChangeBPBDatetoJSDate(order[0]))
    let uniqueCart = new Set(cartDateArray);
    return [...uniqueCart]
}



export const CreateBlankCartDateArray = (orders, chosen)=> {

    let cartDateBlankArray = orders ? orders.filter(order => order[8] === chosen) : [];
    cartDateBlankArray = cartDateBlankArray.map(order => ({'ddate':order[0], 'qqty': Number(order[2])}));
    let holder = {}
    cartDateBlankArray.forEach(d => holder.hasOwnProperty(d.ddate) ? holder[d.ddate] = holder[d.ddate] + d.qqty :
        holder[d.ddate] = d.qqty);

    let BlankDateArray = [];
    for (var prop in holder) {
        let i = prop.split('/')
        let prop2 = i[2]+"-"+i[0]+"-"+i[1]
        BlankDateArray.push([prop2,holder[prop]])
    }

    BlankDateArray = BlankDateArray.filter(ob3 => ob3[1] === 0)
    BlankDateArray = BlankDateArray.map(ob4 => ob4[0])

    return BlankDateArray

}


const CalendarApp = (props) => {

    const { delivDate, setDelivDate } = useContext(CustDateRecentContext);
    const { standing } = useContext(StandingContext);
    const { chosen } = useContext(CustDateRecentContext);
    const { orders } = useContext(OrdersContext);
    
    
    let backToStandingArray = CreateStandingArray(standing,chosen);
    let cartDateArray = CreateCartDateArray(orders,chosen);
    let cartBlankDateArray = CreateBlankCartDateArray(orders,chosen);
    

    let standingEvents = {title: '',
                        daysOfWeek: backToStandingArray,
                        display: 'background'}


    let calendarEvents = [{title: '',
                        date: delivDate,
                        display: 'background'}]


    calendarEvents.push(standingEvents)


    for (let order of cartDateArray) {
        let newEvent = {title: '',
                    date: order,
                    display: 'background'}
        calendarEvents.push(newEvent)
    }


    for (let order of cartBlankDateArray) {
        let newEvent2 = {title: '',
                    date: order,
                    display: 'inverse-background'}
        calendarEvents.push(newEvent2)
    }
    

    const handleDateSelect = (selectInfo) => {
        setDelivDate(selectInfo.dateStr)
    }

    return(  
        <React.Fragment> 
            <div className="calendarApp" id="test">
                <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    defaultView="dayGridMonth"
                    aspectRatio={1}
                    contentHeight="auto"
                    eventBackgroundColor = "blue"
                    dateClick = {handleDateSelect}
                    headerToolbar ={{
                        start: 'title',
                        center: '',
                        end: 'prev,next'
                    }}
                    events = {calendarEvents}    
                />
            </div>
        </React.Fragment>
    );
  }

  
export default CalendarApp;

