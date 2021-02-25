import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'
import { useFetch, FilterStandHoldDups } from '../helpers/useFetch'

import { ToggleContext } from './ToggleContext';

require('dotenv').config()

export const StandingContext = createContext();


export const StandingProvider = (props) => {

    const [standing, setStanding] = useState([]);
    const [ originalStanding, setOriginalStanding ] = useState([]);
    const [ standLoaded, setStandLoaded ] = useState(false)

    return (
        <StandingContext.Provider value={{ standing, setStanding,originalStanding, setOriginalStanding, standLoaded, setStandLoaded }}>
            {props.children}
        </StandingContext.Provider>
    );   
    
};


export const StandingLoad = () => {

    const { data } = useFetch(process.env.REACT_APP_API_STANDING,[]);

    const { setStanding, setOriginalStanding, setStandLoaded } = useContext(StandingContext)
    const { setIsLoading } = useContext(ToggleContext)
    

    useEffect(() => { 
        setIsLoading(true) 
        if(data){
            if(data.length>0){
                let currentData = FilterStandHoldDups(data)
                setOriginalStanding(currentData);
                setStanding(currentData);
                setStandLoaded(true)
                setIsLoading(false)
            }
        }
        console.log(data)
    },[data]);
    


    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

