import React, { useContext } from 'react';
import { CurrentDataContext } from '../dataContexts/CurrentDataContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { CustomerContext } from '../dataContexts/CustomerContext';

import swal from '@sweetalert/with-react';


const OrderCommandLine = () => {

  const { chosen, setChosen, delivDate, setDelivDate, setorderTypeWhole } = useContext(CurrentDataContext)
  const { orders, setOrders } = useContext(OrdersContext)
  const { customers } = useContext(CustomerContext)
  
  const checkForCustomer = (entry, customers) => {

    let nextCustomer = chosen

    if (entry.includes("retail ")){
      setorderTypeWhole(false)
      let newRetailCustName = entry.replace("retail ","")
      let newRetailCustList = [...orders]
      let newRetailCustEntry = ["","",newRetailCustName,"","","",false,""]
      newRetailCustList.push(newRetailCustEntry)
      setOrders(newRetailCustList)
      setChosen(newRetailCustName);
      return
    } 

    for (let cust of customers) {
      if (entry.includes(cust[2]) || entry.includes(cust[0])) {
        nextCustomer = cust[2];
        if (nextCustomer !== ''){
          setChosen(nextCustomer)
          setorderTypeWhole(true)
          return
        }
      };
    };


    if (nextCustomer === '' && chosen === ''){
      swal ({
        text: "Need to choose a customer",
        icon: "error",
        buttons: false,
        timer: 2000
      })
      return
    }

    swal ({
      text: "Say What??",
      icon: "error",
      buttons: false,
      timer: 2000
    })
  return
  };
  
  

  const checkForDelivDate = (entry) => {
    //  check for Sun - Sat
    //  check for today, tomorrow, 2day
    //  check for date format mm/dd/yyyy
    return ''
  };


  const checkForRoute = (entry) => {
    // construct a list based on entry find for chosen and deliv date
    // if no list
    //    retrieve default route from customer profile
    // else
    //    retrieve route from list
    return ''
  };


  const checkForPonotes = (entry) => {
    // construct a list based on entry find for chosen and deliv date
    // if no list
    //    ponote = ''
    // else
    //    retrieve ponote from list
    return ''
  };
 
  
  
  const checkForProducts = (entry, newRoute, newPonote) => {
    
    /*}
    let isThereAProduct = /\d+\s\w+/g.test(entry)
   
    if (isThereAProduct){
      const array = [...entry.matchAll(/\d+\s\w+/g)];
      let enteredProducts = array.map(item => item[0].split(" "))
      let ordersToUpdate = [];
      for (let prod of products){
        for (let item of enteredProducts){
          if (prod[2] === item[1]){
            let newOrder = [item[0],prod[1], chosen, newPonote, newRoute, item[0], orderTypeWhole] // [ qty, prod, cust, po, route, so, ty ]
            ordersToUpdate.push(newOrder)
          }
  
        }
      }
    */
    return []
  }
  
  
  const interpretEntry = async (entry) => {
    checkForCustomer(entry, customers)
    
    
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
