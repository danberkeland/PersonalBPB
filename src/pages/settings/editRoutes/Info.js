import React from 'react';

import { InputText } from "primereact/inputtext";

import { setValue, fixValue } from '../../../helpers/formHelpers'


const Info = ({ selectedRoute, setSelectedRoute }) => {
    
    
    return (
        <React.Fragment>
            <h2><i className="pi pi-map"></i> Route Info</h2>

            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <label htmlFor="zoneName"> Route Name</label><br />
                </span> 

            <InputText id="routeName" placeholder={selectedRoute.routeName} disabled
              onKeyUp={e => e.code==="Enter" && setSelectedRoute(setValue(e, selectedRoute))} 
              onBlur={e => setSelectedRoute(fixValue(e, selectedRoute))}/>

            </div><br />

            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <label htmlFor="zoneName"> Route Start</label><br />
                </span> 

            <InputText id="routeStart" placeholder={selectedRoute.routeStart}
              onKeyUp={e => e.code==="Enter" && setSelectedRoute(setValue(e, selectedRoute))} 
              onBlur={e => setSelectedRoute(fixValue(e, selectedRoute))}/>

            </div><br />

            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <label htmlFor="zoneName"> Route Time</label><br />
                </span> 

            <InputText id="routeTime" placeholder={selectedRoute.routeTime}
              onKeyUp={e => e.code==="Enter" && setSelectedRoute(setValue(e, selectedRoute))} 
              onBlur={e => setSelectedRoute(fixValue(e, selectedRoute))}/>

            </div><br />

            
        </React.Fragment>         
  );
}

export default Info;
