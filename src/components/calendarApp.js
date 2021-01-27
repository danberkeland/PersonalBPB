import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


const CalendarApp = () => {

    return (
        <div className="calendarApp" id="test">
            <div className="calendarApp" id="test">
                <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    aspectRatio={1}
                    contentHeight="auto"
                    eventBackgroundColor = "blue"
                    // dateClick = {handleDateSelect}
                    headerToolbar ={{
                        start: 'title',
                        center: '',
                        end: 'prev,next'
                    }}
                         
                />
            </div>
        </div>
    )
  }

  
export default CalendarApp;
