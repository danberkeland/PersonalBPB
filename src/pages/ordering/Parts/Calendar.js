import React, { useContext, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import {
  CreateStandingArray,
  CreateCartDateArray,
  CreateBlankCartDateArray,
} from "../../../helpers/calendarBuildHelper";


const Calendar = ({ database }) => {
  const {
    chosen,
    delivDate,
    setDelivDate,
    calendarEvents,
    setCalendarEvents,
  } = useContext(CurrentDataContext);
  const [products, customers, routes, standing, orders] = database;
  const { setModifications } = useContext(ToggleContext)


  useEffect(() => {
    if (database.length>0){
    let backToStandingArray = CreateStandingArray(standing, chosen);
    let cartDateArray = CreateCartDateArray(orders, chosen);
    let cartBlankDateArray = CreateBlankCartDateArray(orders, chosen);
    
    let standingEvents = {
      groupID: "standing",
      daysOfWeek: backToStandingArray,
      
      display: "background"
      
     
    };

   

    let calendarEvents = [
      { groupID: "delivdate", date: delivDate, display: "background" },
    ];

    calendarEvents.push(standingEvents);
    

    for (let order of cartDateArray) {
      let newEvent = { groupID: "cart", date: order, display: "background" };
      calendarEvents.push(newEvent);
    }
    
    for (let order of cartBlankDateArray) {
      let newEvent2 = { groupID: "blanks", date: order, display: "background" };
      calendarEvents.push(newEvent2);
    }
    
   
    setCalendarEvents(calendarEvents);
  }
  }, [chosen, delivDate, database]);

  const handleDateSelect = (selectInfo) => {
    try{
      document.getElementById("orderCommand").focus();
    } catch {
      console.log()
    }
   
    setDelivDate(selectInfo.dateStr);
    
  
  };

  return (
    <React.Fragment>
      <div className="calendarApp" id="test">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          defaultView="dayGridMonth"
          aspectRatio={1}
          contentHeight="auto"
          eventBackgroundColor="blue"
          dateClick={handleDateSelect}
          headerToolbar={{
            start: "title",
            center: "",
            end: "prev,next",
          }}
          events={calendarEvents}
        />
      </div>
    </React.Fragment>
  );
};

export default Calendar;
