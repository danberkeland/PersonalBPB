import React, { useState, createContext } from 'react';

export const ToggleContext = createContext();


export const ToggleProvider = (props) => {

    const [orderTypeWhole, setOrderTypeWhole] = useState(true)
    const [ ordersHasBeenChanged, setOrdersHasBeenChanged ] = useState(false);
    const [ modifications, setModifications ] = useState(false)
    const [ routeIsOn, setRouteIsOn ] =useState(false)
    const [ cartList, setCartList ] = useState(true)
    const [ standList, setStandList ] = useState(true)
    const [ PONoteIsOn, setPONoteIsOn ] = useState(false)
    const [ editOn, setEditOn ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ readyForSq, setReadyForSq ] = useState(false)
    const [ readyForWeekly, setReadyForWeekly ] = useState(false)
    const [ reload, setReload ] = useState(false)

    return (
        <ToggleContext.Provider 
            value={{    
                orderTypeWhole, setOrderTypeWhole,
                ordersHasBeenChanged, setOrdersHasBeenChanged,
                modifications, setModifications,
                routeIsOn, setRouteIsOn,
                cartList, setCartList,
                standList, setStandList,
                PONoteIsOn, setPONoteIsOn,
                editOn, setEditOn,
                isLoading, setIsLoading,
                readyForSq, setReadyForSq,
                readyForWeekly, setReadyForWeekly,
                reload, setReload
            }}>
            {props.children}
        </ToggleContext.Provider>
    );   
    
};

