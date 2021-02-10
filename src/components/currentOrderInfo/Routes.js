import React, { useContext } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { RoutesContext } from '../../dataContexts/RoutesContext';
import { ToggleContext } from '../../dataContexts/ToggleContext';


const Routes = () => {

    const { route, setRoute } = useContext(CurrentDataContext)
    const { routes } = useContext(RoutesContext)
    const { routeIsOn } = useContext(ToggleContext)

    
    
    const handleChange = e => {

        let newRoute = e.target.value
        setRoute(newRoute);
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