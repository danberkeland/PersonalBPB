import React from 'react';
import { useContext } from 'react';
import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { ProductsContext } from '../dataContexts/ProductsContext';




const OrderCommandLine = () => {

  const { customers, route } = useContext(CustomerContext)
  const { products } = useContext(ProductsContext)
  const { chosen, setChosen, delivDate, setDelivDate, setorderTypeWhole } = useContext(CustDateRecentContext)
  const { thisOrder, setThisOrder, ponotes } = useContext(OrdersContext)


  const checkForCustomer = (entry, customers) => {
    let nextCustomer = chosen;

    if (entry.includes("retail ")){
      setorderTypeWhole(false)
      let newRetailCustName = entry.replace("retail ","")
      return(newRetailCustName)
    } 
    
    for (let cust of customers) {
      if (entry.includes(cust[2]) /*Full name*/ || entry.includes(cust[0]) /* Nickname */) {
        nextCustomer = cust[2]; /*Full name*/
        // make sure ui is on whole setting
        document.getElementById("customers").value = cust[2]; /*Full name*/
      };
    };
    return nextCustomer;
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
    //    ponotes = ''
    // else
    //    retrieve ponotes from list
    return ''
  };
  
  
  
  const checkForProducts = (entry, newRoute, newPonote) => {
    // test for regex match in string
    let isThereAProduct = /\d+\s\w+/g.test(entry)
    // if true, build array of matches
    if (isThereAProduct){
      const array = [...entry.matchAll(/\d+\s\w+/g)];
      let enteredProducts = array.map(item => item[0].split(" "))
      let ordersToUpdate = [];
      for (let prod of products){
        for (let item of enteredProducts){
          if (prod[2] === item[1]){
            let newOrder = [item[0],prod[1], chosen, newPonote, newRoute] //ADD WHOLE OR RETAIL ATTRIBUTE
            ordersToUpdate.push(newOrder)
          }
  
        }
      }
    
    return ordersToUpdate
  }}
  
  
  const interpretEntry = async (entry) => {
    let newCust = chosen
    let custEntry = await checkForCustomer(entry, customers)
    custEntry === '' ? newCust = chosen : newCust = custEntry

    let newDelivDate = delivDate
    let delivDateEntry = await checkForDelivDate(entry)
    delivDateEntry === '' ? newDelivDate = delivDate : newDelivDate = delivDateEntry

    let newRoute = await checkForRoute()

    let newPonotes = await checkForPonotes()

    let newProductArray = await checkForProducts(entry, newRoute, newPonotes)

    return [newCust, newDelivDate, newProductArray]
  };

  
  

  const handleInput = async (entry) => {
    if (entry.key === "Enter") {
      let [ newCust, newDelivDate, newProductArray ] = await interpretEntry(entry.target.value)
      document.getElementById("orderCommand").value = ''; //clear the command line
      processEntry(newCust, newDelivDate, newProductArray)
    }      
  };

  const processEntry = (cust, JSdate, prodArray) => {
    if (cust) {setChosen(cust)};
    if (JSdate) {setDelivDate(JSdate)};
    let newThisOrder = [...thisOrder]
    if (prodArray) {
      for (let prod of prodArray) {
        // check to see if newProd is a duplicate
        //    if so, find index and update
        //    if not, push new prod
        newThisOrder.push(prod)
      }
      setThisOrder(newThisOrder)
    }
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
