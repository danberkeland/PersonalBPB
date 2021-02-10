import React, { useState, createContext } from 'react';

export const ToggleContext = createContext();


export const ToggleProvider = (props) => {

    const [orderTypeWhole, setOrderTypeWhole] = useState(true)
    const [ ordersHasBeenChanged, setOrdersHasBeenChanged ] = useState(false);
    const [ modifications, setModifications ] = useState(false)
    const [ routeIsOn, setRouteIsOn ] =useState(false)
    const [ cartList, setCartList ] = useState(true)
    const [ standList, setStandList ] = useState(true)

    return (
        <ToggleContext.Provider 
            value={{    
                orderTypeWhole, setOrderTypeWhole,
                ordersHasBeenChanged, setOrdersHasBeenChanged,
                modifications, setModifications,
                routeIsOn, setRouteIsOn,
                cartList, setCartList,
                standList, setStandList
            }}>
            {props.children}
        </ToggleContext.Provider>
    );   
    
};

