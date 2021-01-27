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


const CalendarApp = (props) => {

    const { delivDate, setDelivDate } = useContext(CustDateRecentContext);
    const { standing } = useContext(StandingContext);
    const { chosen } = useContext(CustDateRecentContext);
    const { orders } = useContext(OrdersContext)
    
    
    let backToStandingArray = CreateStandingArray(standing,chosen);
    let cartDateArray = CreateCartDateArray(orders,chosen)
    let cartBlankDateArray = [];
    

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
    );
  }

  
export default CalendarApp;

