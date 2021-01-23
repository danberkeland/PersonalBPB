import React,{ useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { OrdersContext } from '../dataContexts/OrdersContext';

import { CreateCalendarEvents } from '../helpers/createCalendarEvents';


const CalendarApp = (props) => {
  
    const [orders, setOrder, orderDate, setOrderDate] = useContext(OrdersContext);

    const calendarEvents = CreateCalendarEvents();

    const handleDateSelect = (selectInfo) => {
        setOrderDate(selectInfo.dateStr)
    }


    return(
        
            <div className="calendarApp">
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
