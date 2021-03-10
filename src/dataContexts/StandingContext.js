import React, { useState, createContext, useContext, useEffect } from 'react';

import { FilterStandHoldDups } from '../helpers/useFetch'

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'

import { listStandings } from '../graphql/queries'

import { API, graphqlOperation } from 'aws-amplify';


require('dotenv').config()

export const StandingContext = createContext();


export const StandingProvider = (props) => {

    const [standing, setStanding] = useState([]);
    const [ originalStanding, setOriginalStanding ] = useState([]);
    const [ standLoaded, setStandLoaded ] = useState(false)

    return (
        <StandingContext.Provider value={{ standing, setStanding,originalStanding, setOriginalStanding, standLoaded, setStandLoaded }}>
            {props.children}
        </StandingContext.Provider>
    );   
    
};


export const StandingLoad = () => {

    const { setStanding, setOriginalStanding, setStandLoaded } = useContext(StandingContext)

    useEffect(() => {
        fetchStanding()
    },[])



    const fetchStanding = async () => {
        try{
            const standData = await API.graphql(graphqlOperation(listStandings, {
                limit: '5000'
                }))
            const standList = standData.data.listStandings.items;
            let noDelete = standList.filter(stand => stand["_deleted"]!==true)
            
            
            let sortedData = sortAtoZDataByIndex(noDelete,"timeStamp")
            let currentData = FilterStandHoldDups(sortedData)
           
           
            setOriginalStanding(currentData);
           
            setStanding(currentData);
            setStandLoaded(true)
        } catch (error){
          console.log('error on fetching Standing List', error)
        }
      }
  


    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

