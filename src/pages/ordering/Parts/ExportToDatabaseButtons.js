import React, { useContext } from 'react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';
import { CustomerContext } from '../../../dataContexts/CustomerContext';
import { ProductsContext } from '../../../dataContexts/ProductsContext';

import { createCustomer, createProduct } from '../../../graphql/mutations'

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

const handleUpdateOrders = () => {}

const handleUpdateStanding = () => {}

const handleUpdateHolding = () => {}
 
  

  return (         
    <OrderButtons>
      <Button disabled label="ExportCustomers" icon="pi pi-upload" onClick={handleUpdateCustomers}
        className={"p-button-raised p-button-rounded p-button-success"} />
      <Button disabled label="ExportProducts" icon="pi pi-upload" onClick={handleUpdateProducts}
        className={"p-button-raised p-button-rounded p-button-success"} />
      <Button label="ExportOrders" icon="pi pi-upload" onClick={handleUpdateOrders}
        className={"p-button-raised p-button-rounded p-button-success"} />
      <Button label="ExportHolding" icon="pi pi-upload" onClick={handleUpdateHolding}
        className={"p-button-raised p-button-rounded p-button-success"} />
    <Button label="ExportStanding" icon="pi pi-upload" onClick={handleUpdateStanding}
        className={"p-button-raised p-button-rounded p-button-success"} />
      
    </OrderButtons>    
  );


}




export default ExportToDatabaseButtons;