import React, { useState, createContext } from 'react';


export const RouteContext = createContext();

export const RouteProvider = (props) => {
    const [routes, setRoute] = useState(["AM Pastry","AM North","Lunch","High St."])
    
    return (
        <RouteContext.Provider value={[routes, setRoute]}>
            {props.children}
        </RouteContext.Provider>
    );
}



