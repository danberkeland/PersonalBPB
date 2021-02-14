import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex,addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch, FilterStandHoldDups } from '../helpers/useFetch'

import { ProgressSpinner } from 'primereact/progressspinner';

require('dotenv').config()

export const StandingContext = createContext();


export const StandingProvider = (props) => {

    const [standing, setStanding] = useState([]);
    const [ originalStanding, setOriginalStanding ] = useState([]);

    return (
        <StandingContext.Provider value={{ standing, setStanding,originalStanding, setOriginalStanding }}>
            {props.children}
        </StandingContext.Provider>
    );   
    
};


export const StandingLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_STANDING,[]);

    const { setStanding, setOriginalStanding } = useContext(StandingContext)
    

    useEffect(() => {
        if(data){
            let currentData = FilterStandHoldDups(data)
            sortAtoZDataByIndex(currentData,7)
            let newData = addAnEmptyRowToTop(currentData)
            setOriginalStanding(newData);
            setStanding(newData);
        }   
    },[data, setOriginalStanding, setStanding]);

    return (
        <React.Fragment>
            { loading && <div className = "Loader"><div className = "loaderBack"><ProgressSpinner/></div></div>}
            { error && <p> error while loading standing orders!</p>}
        </React.Fragment>
    )
    
};

