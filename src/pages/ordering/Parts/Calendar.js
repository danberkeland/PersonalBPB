import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Calendar } from "primereact/calendar";
import interactionPlugin from "@fullcalendar/interaction";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import {
  CreateStandingArray,
  CreateCartDateArray,
  CreateBlankCartDateArray,
} from "../../../helpers/calendarBuildHelper";
import { convertDatetoBPBDate } from "../../../helpers/dateTimeHelpers";

const Cal = ({ database }) => {
  const { chosen, delivDate, setDelivDate, calendarEvents, setCalendarEvents } =
    useContext(CurrentDataContext);
  const [products, customers, routes, standing, orders] = database;
  const { setModifications } = useContext(ToggleContext);

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  useEffect(() => {
    if (database.length > 0) {
      let backToStandingArray = CreateStandingArray(standing, chosen);
      let cartDateArray = CreateCartDateArray(orders, chosen);
      let cartBlankDateArray = CreateBlankCartDateArray(orders, chosen);

      let standingEvents = {
        groupID: "standing",
        daysOfWeek: backToStandingArray,

        display: "background",
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
        let newEvent2 = {
          groupID: "blanks",
          date: order,
          display: "background",
        };
        calendarEvents.push(newEvent2);
      }

      setCalendarEvents(calendarEvents);
    }
  }, [chosen, delivDate, database]);

  const handleDateSelect = (selectInfo) => {
    try {
      document.getElementById("orderCommand").focus();
    } catch {
      console.log();
    }
    console.log(selectInfo);
    setDelivDate(selectInfo.dateStr);
  };

  const innards1 = (
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
  );

  const dayOfTheWeek = (date) => {};

  const dateTemplate = (date) => {
   
    let dateDaySup = "";
    
    let dateDay = dayOfTheWeek(date);
   
    let delivDay = Number(delivDate.split('-')[2])
    let delivMonth = Number(delivDate.split('-')[1])-1
    let delivYear = Number(delivDate.split('-')[0])
    let dateStyle;
    try {
        
        if (date.day === delivDay && date.month === delivMonth && date.year === delivYear) {
          return (
            <div
              style={{
                backgroundColor: "#2c8fe6",
                color: "#fcf06d",
                fontWeight: "bold",
                borderRadius: "50%",
                width: "3em",
                height: "3em",
                lineHeight: "3em",
                padding: "0em 1em"
              }}
            >
              {date.day}
            </div>
          );
          //}
          // if date = date(year-day-month) and groupID = cart => cartStyle
          // if date = date(year-day-month) and groupID = blanks => blanks
        } else{
          return date.day
        
      }
    } catch (error) {
      console.log(error);
    }
    return dateStyle;
  };

  const innards2 = (
    <div className="p-field p-col-12 p-md-4">
      <Calendar
        id="mask"
        value={delivDate}
        onChange={(e) => console.log(e)}
        dateTemplate={dateTemplate}
      />
    </div>
  );

  return (
    <React.Fragment>{width > breakpoint ? innards1 : innards2}</React.Fragment>
  );
};

export default Cal;
