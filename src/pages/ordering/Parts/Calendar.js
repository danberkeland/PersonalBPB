import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Calendar } from "primereact/calendar";
import interactionPlugin from "@fullcalendar/interaction";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";

import {
  CreateStandingArray,
  CreateCartDateArray,
  CreateBlankCartDateArray,
} from "../../../helpers/calendarBuildHelper";

const { DateTime } = require("luxon");

const Cal = () => {
  const { largeScreen, database, chosen, delivDate, setDelivDate, calendarEvents, setCalendarEvents } =
    useContext(CurrentDataContext);
  const [products, customers, routes, standing, orders] = database;
  const [calDate, setCalDate] = useState(new Date(delivDate.replace("-", "/")));


  useEffect(() => {
    setCalDate(new Date(delivDate.replace("-", "/")));
  }, [delivDate]);

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

    setDelivDate(selectInfo.dateStr);
  };

  const bigScreen = (
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


  const dateTemplate = (date) => {
    let delivDay = Number(delivDate.split("-")[2]);
    let delivMonth = Number(delivDate.split("-")[1]) - 1;
    let delivYear = Number(delivDate.split("-")[0]);
    try {
      for (let cal of calendarEvents) {
        try {
          let calDay = Number(cal.date.split("-")[2]);
          let calMonth = Number(cal.date.split("-")[1]) - 1;
          let calYear = Number(cal.date.split("-")[0]);
          if (
            date.day === calDay &&
            date.month === calMonth &&
            date.year === calYear &&
            cal.groupID === "blanks"
          ) {
            return date.day;
          }
        } catch (error) {}
      }
    } catch (error) {}
    try {
      if (
        date.day === delivDay &&
        date.month === delivMonth &&
        date.year === delivYear
      ) {
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
              padding: "0em 1em",
            }}
          >
            {date.day}
          </div>
        );
      }
    } catch (error) {}
    try {
      for (let cal of calendarEvents) {
        try {
          let calDay = Number(cal.date.split("-")[2]);
          let calMonth = Number(cal.date.split("-")[1]) - 1;
          let calYear = Number(cal.date.split("-")[0]);
          if (
            date.day === calDay &&
            date.month === calMonth &&
            date.year === calYear &&
            cal.groupID === "cart"
          ) {
            return (
              <div
                style={{
                  backgroundColor: "#7acc90",
                  color: "#ffffff",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "3em",
                  height: "3em",
                  lineHeight: "3em",
                  padding: "0em 1em",
                }}
              >
                {date.day}
              </div>
            );
            
          }
        } catch (error) {}
      }
    } catch (error) {}
   
    return date.day;
  };

  const handlePhoneChange = (date) => {
    let year = date.value.getFullYear();
    let month = date.value.getMonth() + 1;
    let day = date.value.getDate();
    let formatted = year + "-" + month + "-" + day;

    setDelivDate(formatted);
  };

  const smallScreen = (
    <div className="p-field p-col-12 p-md-4">
      <Calendar
        id="mask"
        placeholder={delivDate}
        value={calDate}
        onChange={(e) => handlePhoneChange(e)}
        dateTemplate={dateTemplate}
      />
    </div>
  );

  return (
    <React.Fragment>{largeScreen ? bigScreen : smallScreen}</React.Fragment>
  );
};

export default Cal;
