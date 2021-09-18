import React, { useState, createContext, useContext, useEffect } from 'react';

import { listCustomers } from '../graphql/queries'

import { API, graphqlOperation } from 'aws-amplify';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'




export const CustomerContext = createContext();

export const CustomerProvider = (props) => {

    const [customers, setCustomer] = useState([]);
    const [ custLoaded, setCustLoaded ] = useState(false)
    
    
    return (
        <CustomerContext.Provider value={{ 
            customers, setCustomer, 
            custLoaded, setCustLoaded
            }}>
            {props.children}
        </CustomerContext.Provider>
    );   
    
};


export const CustomerLoad = () => {

    const { setCustomer, setCustLoaded } = useContext(CustomerContext)

    useEffect(() => {
        fetchCustomers()
    },[])



    const fetchCustomers = async () => {
        try{
          const custData = await API.graphql(graphqlOperation(listCustomers, {
                limit: '500'
                }))
          const custList = custData.data.listCustomers.items;
          sortAtoZDataByIndex(custList,"custName")
          let noDelete = custList.filter(cust => cust["_deleted"]!==true)
         
          setCustomer(noDelete)
          setCustLoaded(true)
        } catch (error){
          console.log('error on fetching Cust List', error)
        }
      }
  

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

