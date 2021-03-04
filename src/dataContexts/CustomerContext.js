import React, { useState, createContext, useContext, useEffect } from 'react';

import { listCustomers } from '../graphql/queries'

import { API, graphqlOperation } from 'aws-amplify';


export const CustomerContext = createContext();

const sortAtoZDataByIndex = (data,index) => {
    data.sort(function(a,b){return a[index]>b[index] ? 1 : -1;})
    return data
}


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
          const custData = await API.graphql(graphqlOperation(listCustomers))
          const custList = custData.data.listCustomers.items;
          sortAtoZDataByIndex(custList,"custName")
          setCustomer(custList)
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

