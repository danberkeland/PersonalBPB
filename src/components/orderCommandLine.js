import React, { useContext } from 'react';

import { CurrentDataContext } from '../dataContexts/CurrentDataContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { StandingContext } from '../dataContexts/StandingContext';
import { ProductsContext } from '../dataContexts/ProductsContext';
import { ToggleContext } from '../dataContexts/ToggleContext';

import { todayPlus, daysOfTheWeek, convertDatetoBPBDate, convertDatetoStandingDate } from '../helpers/dateTimeHelpers'

import swal from '@sweetalert/with-react';


const clonedeep = require('lodash.clonedeep')


const OrderCommandLine = () => {

  const { chosen, setChosen, delivDate, setDelivDate, route, ponote } = useContext(CurrentDataContext)
  const { orders, setOrders } = useContext(OrdersContext)
  const { customers } = useContext(CustomerContext)
  const { standing } = useContext(StandingContext)
  const { products } = useContext(ProductsContext)
  const { orderTypeWhole, setOrderTypeWhole, setRouteIsOn } = useContext(ToggleContext)
  
  let [ today, tomorrow, twoDay ] = todayPlus()

  const checkForCustomer = (entry, customers) => {

    let nextCustomer = chosen

    if (entry.includes("retail ")){
      setOrderTypeWhole(false)
      let newRetailCustName = entry.replace("retail ","")
      let newRetailCustList = [...orders]
      let newRetailCustEntry = ["","",newRetailCustName,"","","",false,""]
      newRetailCustList.push(newRetailCustEntry)
      setOrders(newRetailCustList)
      setDelivDate(tomorrow)
      setChosen(newRetailCustName);
      return
    } 

    for (let cust of customers) {
      if (entry.includes(cust[2]) || entry.includes(cust[0])) {
        nextCustomer = cust[2];
        if (nextCustomer !== ''){
          setChosen(nextCustomer)
          setRouteIsOn(true)
          setDelivDate(tomorrow)
          setOrderTypeWhole(true)
          return
        }
      };
    };


    if (nextCustomer === '' && chosen === ''){
      swal ({
        text: "Please choose a customer",
        icon: "error",
        buttons: false,
        timer: 2000
      })
      return
    }

    
    return false
  };
  
  

  const checkForDelivDate = (entry) => {
    let [ today, tomorrow, twoDay ] = todayPlus()
    let [ Sun, Mon, Tues, Wed, Thurs, Fri, Sat ] = daysOfTheWeek()
    let dateWords = [ ['today',today],['tomorrow',tomorrow],['twoday',twoDay],
                      ['sun',Sun],['mon',Mon],['tue',Tues],['tues',Tues],['wed',Wed],['thu',Thurs],
                      ['thur',Thurs],['thurs',Thurs],['fri',Fri],['sat',Sat]]
    for (let wordSet of dateWords){
      if(entry.includes(wordSet[0])){
        setDelivDate(wordSet[1])
      }
      
    }
  };

  
  
  const checkForProducts = (entry) => {
    
    
    let isThereAProduct = /\d+\s\w+/g.test(entry)
    if (isThereAProduct){
      let newOrder
      const array = [...entry.matchAll(/\d+\s\w+/g)];
      let enteredProducts = array.map(item => item[0].split(" "))
      let ordersToUpdate = [];
      for (let prod of products){
        for (let item of enteredProducts){
          if (prod[2] === item[1]){
            newOrder = [item[0],prod[1], chosen, ponote, route, "0", orderTypeWhole, convertDatetoBPBDate(delivDate)] // [ qty, prod, cust, po, route, so, ty ]
            ordersToUpdate.push(newOrder)
          }
  
        }
      }
    
      console.log(ordersToUpdate)

      // create map of orders for cust, delivdate #1

      // Build Orders List based on delivDate and Chosen
      let BPBDate = convertDatetoBPBDate(delivDate)
      let filteredOrders = clonedeep(orders)
      let cartList = filteredOrders ? filteredOrders.filter(order => order[7] === BPBDate && order[2] === chosen) : [];
      
      // Build Standing LIst based on delivDate and Chosen
      let standingDate = convertDatetoStandingDate(delivDate);  
      let filteredStanding = clonedeep(standing)
      let standingList = filteredStanding ? filteredStanding.filter(standing => standing[0] === standingDate && standing[8] === chosen) : [];
      let convertedOrderList = standingList.map(order => [    order[2],
                                                              order[7],
                                                              order[8],
                                                              'na',
                                                              order[6],
                                                              order[2], 
                                                              order[3] !== "9999" ? true : false,
                                                              convertDatetoBPBDate(delivDate)])
      
      // Compare Order List to Stand List and give Order List precedence in final list                                                        
      let custOrderList = cartList.concat(convertedOrderList)
      for (let i=0; i<custOrderList.length; ++i ){
          for (let j=i+1; j<custOrderList.length; ++j){
              if (custOrderList[i][1] === custOrderList[j][1]){
                  custOrderList.splice(j,1);
              }
          }
      }

      console.log(custOrderList)
      // new product by new product, check if it exists
      let ordersToModify = [...orders]
      if (custOrderList.length>0){
        for (let ord of ordersToUpdate){
          for (let custOrd of custOrderList){
            if (ord[1] === custOrd[1]){
            
              let index = ordersToModify.findIndex(order => order[1] === custOrd[1] &&
                    order[2] === chosen && order[7] === convertDatetoBPBDate(delivDate));
              if (index>=0){
                ordersToModify[index][0] = ord[0] 
                     
              } else{
                ord[5] = custOrd[5]
                ordersToModify.push(ord)
                
              }
            }
          }    
        }
      }
      for (let ord of ordersToUpdate){
        for (let mod in ordersToModify){
          let index = ordersToModify.findIndex(order => order[1] === ord[1] &&
            order[2] === chosen && order[7] === convertDatetoBPBDate(delivDate));
          if (index<0){
            ordersToModify.push(ord)
          }
        }
      }
      // for order in ordersToModify
      //      if index not in orders - push order into ordersToModify
      setOrders(ordersToModify)
      
    }
  }


  const interpretEntry = async (entry) => {
    checkForCustomer(entry, customers)

    checkForDelivDate(entry)
    checkForProducts(entry)
  };

  

  const handleInput = (entry) => {
     if (entry.key === "Enter") {
        interpretEntry(entry.target.value)
        document.getElementById("orderCommand").value = ''; 
        
    }
    return
  };

  

  
  
  return (        
    <div className = "orderCommandLine">
      <input  type="text" 
              id="orderCommand" 
              className="orderCommand"
              name="orderCommand" 
              placeholder="Enter Customers, Orders, Dates ..."
              onKeyUp={e => handleInput(e)}>

      </input>
    </div>     
  );
}

export default OrderCommandLine;
