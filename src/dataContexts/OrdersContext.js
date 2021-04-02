import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'

import { listOrders } from '../graphql/queries'
import { createOrder } from '../graphql/mutations'

import { API, graphqlOperation } from 'aws-amplify';
import { ProductsContext } from './ProductsContext';


require('dotenv').config()

export const OrdersContext = createContext();


export const OrdersProvider = (props) => {
    
    const [orders, setOrders] = useState([]);
    const [ recentOrders, setRecentOrders ] = useState([]);
    const [ originalOrders, setOriginalOrders ] = useState([]);
    const [ ordersLoaded, setOrdersLoaded ] = useState(false)

    
    return (
        <OrdersContext.Provider value={{ 
            orders, setOrders, 
            recentOrders, setRecentOrders,
            originalOrders, setOriginalOrders,
            ordersLoaded, setOrdersLoaded
            }}>

            {props.children}

        </OrdersContext.Provider>
    );   
    
};



export const OrdersLoad = () => {

    const { setOrders, setOriginalOrders, setOrdersLoaded } = useContext(OrdersContext)
    const { products } = useContext(ProductsContext)
 

    useEffect(() => {
        buildOrders()
        
    },[products])


    const buildOrders = async () => {
        let ord = await fetchOrders()
        let build = await fetchSq(ord)
        
        setOrdersLoaded(true)

    }

    const fetchOrders = async () => {
        try{
            const ordData = await API.graphql(graphqlOperation(listOrders, {
                  limit: '5000'
                  }))
            const ordList = ordData.data.listOrders.items;
                
            let noDelete = ordList.filter(cust => cust["_deleted"]!==true)
            let sortedData = sortAtoZDataByIndex(noDelete,"timeStamp")
            sortedData = sortAtoZDataByIndex(sortedData, "prodName")
                
          
            setOrders(sortedData)
            setOriginalOrders(sortedData);
            return sortedData
        }  catch (error){
            console.log('error on fetching Orders List', error)
        }
      }
  

      const fetchSq = async (ords) => {
    
        try {
          let response = await fetch(
            "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"
          );
          
          let newOrders = await response.json();
          newOrders = JSON.parse(newOrders);
            
    
          for (let newOrd of newOrders) {
            let qty = Number(newOrd["qty"]);
            let dt = new Date().toISOString();
            let delivDate = newOrd["delivDate"].split("T")[0];
            delivDate = delivDate.split("-");
            delivDate = delivDate[1] + "/" + delivDate[2] + "/" + delivDate[0];
    
            let locIDBPBN = "16VS30T9E7CM9";
    
            let rt;
            let custName = newOrd["custName"];
           
            let prodName =
              products[
                products.findIndex((prod) => newOrd["item"].includes(prod.squareID))
              ]["prodName"];
             
            if (newOrd["route"] === locIDBPBN) {
              rt = "atownpick";
            } else {
              rt = "slopick";
            }
           
            let itemToAdd = {
              SO: qty,
              qty: qty,
              timeStamp: dt,
              isWhole: false,
              PONote: "paid",
              delivDate: delivDate,
              custName: custName,
              prodName: prodName,
              route: rt,
            };
            console.log(itemToAdd)
           
            // Search orders for object, if doesn't exist, add:
            let ind = ords.findIndex(ord => ord["custName"]===custName && ord["prodName"]===prodName)
            console.log(ind)
            if (ind===-1){
             
              
              try {
                await API.graphql(
                  graphqlOperation(createOrder, { input: { ...itemToAdd } })
                );
              } catch (error) {
                console.log("error on creating Orders", error);
              }
            }
          }
        } catch {
          console.log("Request Failed");
        }
      };






    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

