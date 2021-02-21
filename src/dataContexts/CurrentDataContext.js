import React, { useState, createContext } from 'react';

import { tomorrow } from '../helpers/dateTimeHelpers'


export const CurrentDataContext = createContext();


export const CurrentDataProvider = (props) => {

    const [chosen, setChosen] = useState('  ');
    const [ delivDate, setDelivDate ] = useState(tomorrow());
    const [ ponote, setPonote ] = useState('na')
    const [ route, setRoute ] = useState()
    const [ currentCartList, setCurrentCartList ] = useState([])
    const [ calendarEvents, setCalendarEvents ] = useState({})

    return (
        <CurrentDataContext.Provider 
            value={{    chosen, setChosen, 
                        delivDate, setDelivDate, 
                        ponote, setPonote,
                        route, setRoute,
                        currentCartList, setCurrentCartList,
                        calendarEvents, setCalendarEvents
                        }}>
            {props.children}
        </CurrentDataContext.Provider>
    );   
    
};

