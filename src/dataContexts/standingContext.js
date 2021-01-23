import React, { useState, createContext, useEffect } from 'react';
import { tomorrow } from '../helpers/convertDatetoBPBDate';


export const StandingContext = createContext();


export const StandingProvider = (props) => {

    const [standing, setStanding] = useState([]);
    


    useEffect(() => {
        const apiUrl = "https://c5amws94w4.execute-api.us-east-2.amazonaws.com/test";
        fetch(apiUrl)
        .then(res => res.json())
        .then(data => setStanding(data.body))
    },[]);


    return (
        <StandingContext.Provider value={[standing, setStanding]}>
            {props.children}
        </StandingContext.Provider>
    );
}







