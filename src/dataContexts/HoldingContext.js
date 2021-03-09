import React, { useState, createContext, useContext, useEffect } from 'react';

import { FilterStandHoldDups } from '../helpers/useFetch'

import { sortAtoZDataByIndex, sortZtoADataByIndex } from '../helpers/sortDataHelpers'

import { listHoldings } from '../graphql/queries'

import { API, graphqlOperation } from 'aws-amplify';



require('dotenv').config()

export const HoldingContext = createContext();


export const HoldingProvider = (props) => {

    const [holding, setHolding] = useState([]);
    const [ originalHolding, setOriginalHolding ] = useState([]);
    const [ holdLoaded, setHoldLoaded ] = useState(false)

    return (
        <HoldingContext.Provider value={{ holding, setHolding, originalHolding, setOriginalHolding, holdLoaded, setHoldLoaded }}>
            {props.children}
        </HoldingContext.Provider>
    );   
    
};


export const HoldingLoad = () => {


    const { setHolding, setOriginalHolding, setHoldLoaded } = useContext(HoldingContext)

    useEffect(() => {
        fetchHolding()
    },[])



    const fetchHolding = async () => {
        try{
            const holdData = await API.graphql(graphqlOperation(listHoldings, {
                limit: '5000'
                }))
            const holdList = holdData.data.listHoldings.items;
            let noDelete = holdList.filter(hold => hold["_deleted"]!==true)
            
            
            let sortedData = sortZtoADataByIndex(noDelete,"timeStamp")
            let currentData = FilterStandHoldDups(sortedData)
            console.log(currentData)
           
            setOriginalHolding(currentData);
           
            setHolding(currentData);
            setHoldLoaded(true)
        } catch (error){
          console.log('error on fetching Cust List', error)
        }
      }
  


    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

