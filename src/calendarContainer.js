import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

function calendarContainer() {
  
  return (   
    <div className = "calendarContainer">
      <div className = "calendar">
      <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
      />
      </div>
    </div>   
  )
}

export default calendarContainer;
