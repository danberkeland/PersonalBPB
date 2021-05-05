import React, { useState, createContext, useContext, useEffect } from 'react';

import { listRoutes } from '../graphql/queries'

import { API, graphqlOperation } from 'aws-amplify';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'




export const RoutesContext = createContext();

export const RoutesProvider = (props) => {

    const [routes, setRoutes] = useState([]);
    const [ routesLoaded, setRoutesLoaded ] = useState(false)
    
    
    return (
        <RoutesContext.Provider value={{ 
            routes, setRoutes, 
            routesLoaded, setRoutesLoaded
            }}>
            {props.children}
        </RoutesContext.Provider>
    );   
    
};


export const RoutesLoad = () => {

    const { setRoutes, setRoutesLoaded } = useContext(RoutesContext)

    useEffect(() => {
        fetchRoutes()
      },[])


    const fetchRoutes = async () => {
        try{
          const routeData = await API.graphql(graphqlOperation(listRoutes, {limit: '50'}))
          const routeList = routeData.data.listRoutes.items;
          sortAtoZDataByIndex(routeList,"routeStart")
          setRoutes(routeList)
          setRoutesLoaded(true)
        } catch (error){
          console.log('error on fetching Route List', error)
        }
      }
  

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};


