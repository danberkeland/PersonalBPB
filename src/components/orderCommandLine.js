import React, { useContext } from 'react';
import { CurrentDataContext } from '../dataContexts/CurrentDataContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { ProductsContext } from '../dataContexts/ProductsContext';

import { todayPlus, daysOfTheWeek, convertDatetoBPBDate } from '../helpers/dateTimeHelpers'

import swal from '@sweetalert/with-react';


const OrderCommandLine = () => {

  const { chosen, setChosen, delivDate, setDelivDate, orderTypeWhole, setOrderTypeWhole, route, ponote } = useContext(CurrentDataContext)
  const { orders, setOrders } = useContext(OrdersContext)
  const { customers } = useContext(CustomerContext)
  const { products } = useContext(ProductsContext)
  
  const checkForCustomer = (entry, customers) => {

    let nextCustomer = chosen

    if (entry.includes("retail ")){
      setOrderTypeWhole(false)
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
            newOrder = [item[0],prod[1], chosen, ponote, route, item[0], orderTypeWhole, convertDatetoBPBDate(delivDate)] // [ qty, prod, cust, po, route, so, ty ]
            ordersToUpdate.push(newOrder)
          }
  
        }
      }
    
      console.log(ordersToUpdate)

      // create map of orders for cust, delivdate

      let custOrderList = orders.filter(order => order[7] === convertDatetoBPBDate(delivDate) && order[2] === chosen)
      console.log(custOrderList)

      // new product by new product, check if it exists
      let ord
      if (custOrderList.length<=0){
        console.log("order Does not exist")
        let ordersToModify = [...orders]
        for (ord of ordersToUpdate){
          ordersToModify.push(ord)
        }
        setOrders(ordersToModify)
        return
      }


      for (let ord of ordersToUpdate){
        for (let custOrd of custOrderList){
          if (ord[1] === custOrd[1]){
            console.log("order Exists")
            //      if exists, modify qty
            return
          } 
        }
      }
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
