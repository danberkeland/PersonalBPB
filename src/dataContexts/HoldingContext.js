import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch, FilterStandHoldDups, handleLoadingError } from '../helpers/useFetch'


require('dotenv').config()

export const HoldingContext = createContext();


export const HoldingProvider = (props) => {

    const [holding, setHolding] = useState([]);
    const [ originalHolding, setOriginalHolding ] = useState([]);
    const [ holdLoaded, setHoldLoaded ] = useState(false)

    return (
        <HoldingContext.Provider value={{ holding, setHolding, originalHolding, setOriginalHolding, holdLoaded, setHoldLoaded }}>
            {props.children}
        </HoldingContext.Provider>
    );   
    
};


export const HoldingLoad = () => {

    const { data } = useFetch(process.env.REACT_APP_API_HOLDING,[]);

    const { setHolding, setOriginalHolding, setHoldLoaded } = useContext(HoldingContext)

    useEffect(() => { 
        if(data){
            if(data.length>0){
                let currentData = FilterStandHoldDups(data)
                setOriginalHolding(currentData);
                setHolding(currentData);
                setHoldLoaded(true)
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

