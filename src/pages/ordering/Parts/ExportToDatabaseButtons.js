import React, { useContext } from 'react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { HoldingContext } from '../../../dataContexts/HoldingContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';
import { CustomerContext } from '../../../dataContexts/CustomerContext';
import { ProductsContext } from '../../../dataContexts/ProductsContext';

import { createCustomer, createProduct, createOrder, createStanding, createHolding } from '../../../graphql/mutations'

import Amplify, { API, graphqlOperation } from 'aws-amplify';


import { Button } from 'primereact/button';


import styled from 'styled-components'


const OrderButtons = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 5px 0;
    `




function ExportToDatabaseButtons() {

  

  const { route, ponote } = useContext(CurrentDataContext)
  const { setChosen, delivDate, chosen, currentCartList } = useContext(CurrentDataContext)
  const { orders, setOrders, recentOrders, setRecentOrders } = useContext(OrdersContext)
  const { standing } = useContext(StandingContext)
  const { holding } = useContext(HoldingContext)
  const { customers } = useContext(CustomerContext)
  const { products } = useContext(ProductsContext)
  const { orderTypeWhole, setOrderTypeWhole,modifications, setModifications, 
          cartList, setCartList, standList, setRouteIsOn } = useContext(ToggleContext)

 

const handleUpdateCustomers = async () => {
  for (let cust of customers){

    let custDetails = {
      nickName: cust["nickname"],
      custName: cust["name"],
      zoneName: cust["zoneName"],
      addr1: cust["addr1"],
      addr2: cust["addr2"],
      city: cust["addrCity"],
      zip: cust["addrZip"],
      email: cust["email"],
      firstName: cust["firstName"],
      lastName: cust["lastName"],
      phone: cust["phone"],
      toBePrinted: cust["toBePrinted"],
      toBeEmailed: cust["toBeEmailed"],
      terms: cust["terms"],
      invoicing: cust["invoicing"]
    }
    
    const custData = await API.graphql(graphqlOperation(createCustomer, {input: custDetails}))
    console.log(custData.data)
    
    }
      
  
}

const handleUpdateProducts = async () => {
  for (let prod of products){

    let prodDetails = {
      nickName: prod["nickName"],
      prodName: prod["name"],
      packGroup: prod["packGroup"],
      packSize: prod["packSize"],
      doughType: prod["doughType"],
      freezerThaw: prod["freezerThaw"],
      packGroupOrder: prod["packGroupOrder"]
    }
    
    const prodData = await API.graphql(graphqlOperation(createProduct, {input: prodDetails}))
    console.log(prodData.data)
    
    }
      
  
}

const handleUpdateOrders = async () => {
  for (let ord of orders){

    let ordDetails = {
      qty: ord["qty"],
      custName: ord["custName"],
      prodName: ord["prodName"],
      PONote: ord["PONote"],
      route: ord["route"],
      SO: ord["SO"],
      isWhole: ord["isWhole"],
      delivDate: ord["delivDate"],
      timeStamp: ord["timeStamp"]
    }
    
    const ordData = await API.graphql(graphqlOperation(createOrder, {input: ordDetails}))
    console.log(ordData.data)
    
    }
}

const handleUpdateStanding = async () => {
  for (let stand of standing){

    let standDetails = {
      qty: stand["qty"],
      custName: stand["custName"],
      prodName: stand["prodName"],
      dayNum: stand["dayNum"],
      SO: stand["SO"],
      timeStamp: stand["timeStamp"]
    }
    
    const standData = await API.graphql(graphqlOperation(createStanding, {input: standDetails}))
    console.log(standData.data)
    
    }
}

const handleUpdateHolding = async () => {
  for (let hold of holding){

    let holdDetails = {
      qty: hold["qty"],
      custName: hold["custName"],
      prodName: hold["prodName"],
      dayNum: hold["dayNum"],
      SO: hold["SO"],
      timeStamp: hold["timeStamp"]
    }
    
    const holdData = await API.graphql(graphqlOperation(createHolding, {input: holdDetails}))
    console.log(holdData.data)
    
    }
}
 
  

  return (         
    <OrderButtons>
      <Button disabled label="ExportCustomers" icon="pi pi-upload" onClick={handleUpdateCustomers}
        className={"p-button-raised p-button-rounded p-button-success"} />
      <Button disabled label="ExportProducts" icon="pi pi-upload" onClick={handleUpdateProducts}
        className={"p-button-raised p-button-rounded p-button-success"} />
      <Button disabled label="ExportOrders" icon="pi pi-upload" onClick={handleUpdateOrders}
        className={"p-button-raised p-button-rounded p-button-success"} />
      <Button label="ExportHolding" icon="pi pi-upload" onClick={handleUpdateHolding}
        className={"p-button-raised p-button-rounded p-button-success"} />
    <Button label="ExportStanding" icon="pi pi-upload" onClick={handleUpdateStanding}
        className={"p-button-raised p-button-rounded p-button-success"} />
      
    </OrderButtons>    
  );


}




export default ExportToDatabaseButtons;
