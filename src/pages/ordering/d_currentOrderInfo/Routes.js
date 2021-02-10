import React, { useContext } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { RoutesContext } from '../../../dataContexts/RoutesContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';

import { buildCurrentOrder, addNewInfoToOrders } from '../../../helpers/CartBuildingHelpers'


const Routes = () => {

    const { chosen, delivDate, route, setRoute } = useContext(CurrentDataContext)
    const { routes } = useContext(RoutesContext)
    const { orders, setOrders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { routeIsOn, editOn } = useContext(ToggleContext)

    
    
    const handleChange = e => {

        let newRoute = e.target.value
        
        if (editOn) {
            let currentOrderList = buildCurrentOrder(chosen,delivDate,orders,standing)
            if(currentOrderList){
                currentOrderList.map(item => item[4] = newRoute)
            }
            let updatedOrders = addNewInfoToOrders(currentOrderList, orders)
            setOrders(updatedOrders)
        }
        
        setRoute(newRoute)
    }
    

    return (
        <React.Fragment>
            <label>Routes:</label>
            <select id="routes" name="routes" value={route} onChange={handleChange} 
            disabled={routeIsOn ? false : true}>
            {routes ? routes.map(ro =>  <option id="routes" key={uuidv4()} name={ro}>{ro}</option>) : ''}
            </select>
        </React.Fragment>
    );
};

export default Routes