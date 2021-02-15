import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex,addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch, FilterStandHoldDups } from '../helpers/useFetch'

import { ProgressSpinner } from 'primereact/progressspinner';

require('dotenv').config()

export const StandingContext = createContext();


export const StandingProvider = (props) => {

    const [standing, setStanding] = useState([]);
    const [ originalStanding, setOriginalStanding ] = useState([]);
    const [ standLoaded, setStandLoaded ] = useState(true)

    return (
        <StandingContext.Provider value={{ standing, setStanding,originalStanding, setOriginalStanding, standLoaded, setStandLoaded }}>
            {props.children}
        </StandingContext.Provider>
    );   
    
};


export const StandingLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_STANDING,[]);

    const { setStanding, setOriginalStanding, setStandLoaded } = useContext(StandingContext)
    

    useEffect(() => {
        if(data){
            let currentData = FilterStandHoldDups(data)
            sortAtoZDataByIndex(currentData,7)
            let newData = addAnEmptyRowToTop(currentData)
            setOriginalStanding(newData);
            setStanding(newData);
        }   
    },[data, setOriginalStanding, setStanding]);

    useEffect(() => {
        setStandLoaded(!loading)
    },[loading, setStandLoaded])

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

