import React, { useState, createContext } from "react";



import { tomorrow, todayPlus } from "../helpers/dateTimeHelpers"




export const CurrentDataContext = createContext();

export const CurrentDataProvider = (props) => {
  const [chosen, setChosen] = useState("  ");
  const [delivDate, setDelivDate] = useState(tomorrow());
  const [ponote, setPonote] = useState("");
  const [route, setRoute] = useState();
  const [currentCartList, setCurrentCartList] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState({});
  const [standArray, setStandArray] = useState([]);
  const [database, setDatabase] = useState([]);
  const [largeScreen, setLargeScreen] = useState(true);
  const [authType, setAuthType] = useState(true);
  const [customerGroup, setCustomerGroup] = useState([]);

  return (
    <CurrentDataContext.Provider
      value={{
        chosen,
        setChosen,
        delivDate,
        setDelivDate,
        ponote,
        setPonote,
        route,
        setRoute,
        currentCartList,
        setCurrentCartList,
        calendarEvents,
        setCalendarEvents,
        standArray,
        setStandArray,
        database,
        setDatabase,
        largeScreen, setLargeScreen,
        authType, setAuthType,
        customerGroup, setCustomerGroup
      }}
    >
      {props.children}
    </CurrentDataContext.Provider>
  );
};
