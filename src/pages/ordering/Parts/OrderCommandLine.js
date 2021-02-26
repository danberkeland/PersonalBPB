import React, { useContext } from 'react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { CustomerContext } from '../../../dataContexts/CustomerContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { ProductsContext } from '../../../dataContexts/ProductsContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';

import { todayPlus, daysOfTheWeek } from '../../../helpers/dateTimeHelpers'
import { 
  buildCurrentOrder, 
  testEntryForProduct, 
  createArrayofEnteredProducts,
  createOrdersToUpdate,
  buildOrdersToModify,
  addUpdatesToOrders
  } from '../../../helpers/CartBuildingHelpers'

import { InputText } from 'primereact/inputtext';

import swal from '@sweetalert/with-react';

import styled from 'styled-components'

const CommandLine = styled.span`
    display: grid;
    justify-self: stretch;

    `
 
const OrderCommandLine = () => {

  const { chosen, setChosen, delivDate, setDelivDate, route, ponote } = useContext(CurrentDataContext)
  const { orders, setOrders } = useContext(OrdersContext)
  const { customers } = useContext(CustomerContext)
  const { standing } = useContext(StandingContext)
  const { products } = useContext(ProductsContext)
  const { orderTypeWhole, setOrderTypeWhole, setRouteIsOn } = useContext(ToggleContext)
  
  let tomorrow = todayPlus()[1]



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
    
    if (testEntryForProduct(entry)){
      let enteredProducts = createArrayofEnteredProducts(entry)
      let ordersToUpdate = createOrdersToUpdate(products, enteredProducts, chosen, ponote, route, orderTypeWhole, delivDate)
      let custOrderList = buildCurrentOrder(chosen,delivDate,orders,standing)
      let ordersToModify = [...orders]
      if (custOrderList.length>0){
        ordersToModify = buildOrdersToModify(orders, chosen, delivDate, ordersToUpdate, custOrderList)   
      }
      let addedOrdersToUpdate = addUpdatesToOrders(chosen, delivDate, ordersToUpdate, ordersToModify) 
      setOrders(addedOrdersToUpdate)
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
    <CommandLine>
    <span className="p-float-label">
      <InputText id="orderCommand" size="50"/>
      <label htmlFor="orderCommand">Enter Customers, Orders, Dates ...</label>
    </span>
    </CommandLine>
      
  );
}

export default OrderCommandLine;
