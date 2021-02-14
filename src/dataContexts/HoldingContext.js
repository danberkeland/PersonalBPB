import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex,addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch, FilterStandHoldDups } from '../helpers/useFetch'

import { ProgressSpinner } from 'primereact/progressspinner';

require('dotenv').config()

export const HoldingContext = createContext();


export const HoldingProvider = (props) => {

    const [holding, setHolding] = useState([]);
    const [ originalHolding, setOriginalHolding ] = useState([]);
    const [ holdLoaded, setHoldLoaded ] = useState(true)

    return (
        <HoldingContext.Provider value={{ holding, setHolding, originalHolding, setOriginalHolding, holdLoaded, setHoldLoaded }}>
            {props.children}
        </HoldingContext.Provider>
    );   
    
};


export const HoldingLoad = () => {

    const { loading, data } = useFetch(process.env.REACT_APP_API_HOLDING,[]);

    const { setHolding, setOriginalHolding, setHoldLoaded } = useContext(HoldingContext)

    

    useEffect(() => {
        if(data){
            let currentData = FilterStandHoldDups(data)
            sortAtoZDataByIndex(currentData,7)
            let newData = addAnEmptyRowToTop(currentData)
            setOriginalHolding(newData);
            setHolding(newData);
        }   
    },[data, setOriginalHolding, setHolding]);


    useEffect(() => {
        setHoldLoaded(!loading)
    },[loading, setHoldLoaded])

    

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

