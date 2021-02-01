import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'
import { useFetch } from '../helpers/useFetch'

require('dotenv').config()

export const StandingContext = createContext();


export const StandingProvider = (props) => {

    const [standing, setStanding] = useState([]);

    return (
        <StandingContext.Provider value={{ standing, setStanding }}>
            {props.children}
        </StandingContext.Provider>
    );   
    
};


export const StandingLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_STANDING,[]);

    const { setStanding } = useContext(StandingContext)

    useEffect(() => {
        if(data){
            sortAtoZDataByIndex(data,2)
            setStanding(data);
        }   
    },[data, setStanding]);

    return (
        <React.Fragment>
            { loading && <p>Loading Standing Orders ...</p>}
            { error && <p> error while loading standing orders!</p>}
        </React.Fragment>
    )
    
};

