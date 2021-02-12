import React,{ useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';


const CalendarApp = () => {

    const { setDelivDate, calendarEvents } = useContext(CurrentDataContext);
  
    
    const handleDateSelect = (selectInfo) => {
        document.getElementById("orderCommand").focus()
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

