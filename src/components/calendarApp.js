import React,{ useContext, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';

import { CreateCalendarEvents } from '../helpers/createCalendarEvents';


const CalendarApp = (props) => {
  
    const { setDelivDate } = useContext(CustDateRecentContext);
   

    let calendarEvents = CreateCalendarEvents();
        
    
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

