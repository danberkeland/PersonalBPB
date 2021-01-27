import React, { useEffect, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CreateCalendarEvents } from "../helpers/createCalendarEvents";


const useFetch = url => {
    const [state, setState] = useState({
        loading: true,
        error: false,
        data: [],
    });

    useEffect(() => {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then(data => setState({loading: false, error: false, data: data.body }))
            .catch(error => setState({ loading: false, error, data: [] }));
    }, [url]);

    return state;
};

const Loading = () => (
    <div className="calendarApp" id="test">
                <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    aspectRatio={1}
                    contentHeight="auto"
                    eventBackgroundColor = "blue"
                    headerToolbar ={{
                        start: 'title',
                        center: '',
                        end: 'prev,next'
                    }}       
                />
            </div>
)

const FilledCalendar = ({ items }) => {

    const { calendarEvents, setCalendarEvents } = useContext([])

    useEffect(() => {
        setCalendarEvents(items);
    });

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
                    events = {calendarEvents}        
                />
            </div>
        </div>
    )
}



const CalendarApp = () => {

    const { loading, error, data } = useFetch("https://3rhpf3rkcg.execute-api.us-east-2.amazonaws.com/done");

    return(  
        <React.Fragment>
            { loading && <Loading /> }
            { error && <Loading /> }
            { data? data.length>0 ? <FilledCalendar items={CreateCalendarEvents()}/> : '' : '' }
        </React.Fragment>
            
    );
  }

  
export default CalendarApp;
