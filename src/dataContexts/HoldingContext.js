import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch } from '../helpers/useFetch'

require('dotenv').config()

export const HoldingContext = createContext();


export const HoldingProvider = (props) => {

    const [holding, setHolding] = useState([]);
    const [ originalHolding, setOriginalHolding ] = useState([]);

    return (
        <HoldingContext.Provider value={{ holding, setHolding, originalHolding, setOriginalHolding }}>
            {props.children}
        </HoldingContext.Provider>
    );   
    
};


export const HoldingLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_HOLDING,[]);

    const { setHolding, setOriginalHolding } = useContext(HoldingContext)
    

    useEffect(() => {
        if(data){
            setOriginalHolding(data);
            setHolding(data);
        }   
    },[data, setOriginalHolding, setHolding]);

    return (
        <React.Fragment>
            { loading && <p>Loading Holding Orders ...</p>}
            { error && <p> error while loading standing orders!</p>}
        </React.Fragment>
    )
    
};

