import React, { useState, createContext } from 'react';

export const RoutesContext = createContext();


export const RoutesProvider = (props) => {

    const [ routes, setRoutes ] = useState([])

    return (
        <RoutesContext.Provider 
            value={{    
                routes, setRoutes          
            }}>
            {props.children}
        </RoutesContext.Provider>
    );   
    
};

