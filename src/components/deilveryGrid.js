import React, { useContext, useEffect, useState } from 'react';
import { CurrentDataContext } from '../dataContexts/CurrentDataContext';


const DeliveryGrid = () => {


    /*
    const { delivDate, route } = useContext(CurrentDataContext)

    const [ delivListGrid, setDelivListGrid ] = useState([])

    useEffect(() => {
        let orderList = buildFullOrderList()
        let orderListByDateAndRoute = filterByDateAndRoute(orderList, delivDate, route)
        setDelivListGrid(orderListByDateAndRoute)    
    }, [delivDate, route])
    */
    return (
        <React.Fragment>
            <h1>Nothing to see yet</h1>
        </React.Fragment>
    );
    
};

export default DeliveryGrid;