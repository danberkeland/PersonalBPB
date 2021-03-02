import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch, FilterStandHoldDups, handleLoadingError } from '../helpers/useFetch'



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
    

    useEffect(() => { 
        if(data){
            if(data.length>0){
                let currentData = FilterStandHoldDups(data)
                setOriginalStanding(currentData);
                setStanding(currentData);
                setStandLoaded(true)
            }
        } else {
            handleLoadingError()
        }
    },[data]);
    


    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

