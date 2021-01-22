import React,{ useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { OrdersContext } from '../dataContexts/OrdersContext';


const CalendarApp = (props) => {
  
    const [orders, setOrder, orderDate, setOrderDate] = useContext(OrdersContext);

    const handleDateSelect = (selectInfo) => {
        let mo = selectInfo.dateStr.split('-')[1];
        let day = selectInfo.dateStr.split('-')[2];
        let year = selectInfo.dateStr.split('-')[0];
        let newDate = mo+"/"+day+"/"+year;
        setOrderDate(newDate)
    }


    return(
        
            <div className="calendarApp">
                <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    defaultView="dayGridMonth"
                    aspectRatio={1}
                    contentHeight="auto"
                    eventBackgroundColor = "green"
                    dateClick = {handleDateSelect}
                    headerToolbar ={{
                        start: 'title',
                        center: '',
                        end: 'prev,next'
                    }}
                    events = {[
                        
                        {title: '',
                        daysOfWeek: [1],
                        display: 'background'},

                        {title: '',
                        date: '2021-01-01',
                        display: 'background'},
                    ]}        
                />
            </div>
    );
  }

  
export default CalendarApp;
