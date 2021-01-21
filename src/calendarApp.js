import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";


export default class CalendarApp extends React.Component {
  
    render() {
        return (
            <div className="calendarApp">
                <FullCalendar
                    plugins={[ dayGridPlugin ]}
                    defaultView="dayGridMonth"
                    aspectRatio={1}
                    contentHeight="auto"
                    headerToolbar ={{
                        start: 'title',
                        center: '',
                        end: ''
                    }}
                />
        
            </div>
    );
  }

  
}
