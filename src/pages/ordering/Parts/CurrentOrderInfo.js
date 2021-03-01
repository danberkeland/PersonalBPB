import React, { useContext, useEffect, useState } from 'react';

import { CustomerContext } from '../../../dataContexts/CustomerContext';
import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';

import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';

import { tomorrow } from "../../../helpers/dateTimeHelpers"
import { createRetailOrderCustomers } from "../../../helpers/sortDataHelpers"
import { buildCurrentOrder } from "../../../helpers/CartBuildingHelpers"



import styled from 'styled-components'



const CurrentInfo = styled.div`
    width: 100%;
    display: grid;
    margin: 10px 0;
    grid-template-columns: 1fr;
    column-gap: 10px;
    row-gap: 10px; 
    background-color: lightgrey;
    `

  const SpecialInfo = styled.div`
    width: 100%;
    display: flex;
    margin: 0px 10px 10px 10px;
    `

  const TitleBox = styled.div`
    display: flex;
    width: 90%;
    justify-content: space-between;
    align-items: center;
    `
  const Title = styled.h2`
    padding: 0;
    margin: 10px 0;
    `
  const DateStyle = styled.h4`
    padding: 0;
    color: grey;
    margin: 10px 0;
    `
  const FulfillOptions = styled.div`
    display: grid;
    grid-template-columns: 4fr 1fr 3fr 1fr 3fr 1fr 3fr;
    margin: 10px;
    align-items: center;
    justify-items: left;
    `

  const ho = {
    color: "red"
    }

  const so = {
    color: "rgb(66, 97, 201)"
    }


const CurrentOrderInfo = () => {

  const {cartList, standList, orderTypeWhole, setModifications } = useContext(ToggleContext)
  const { orders } = useContext(OrdersContext)
  const { standing } = useContext(StandingContext)
  const { customers } = useContext(CustomerContext)
  const { chosen, route, setRoute, ponote, setPonote, setChosen, delivDate, setDelivDate, currentCartList } = useContext(CurrentDataContext)

  const [ customerGroup, setCustomerGroup ] = useState(customers)


  let orderType
  cartList ? orderType = "Cart" : standList ? orderType = "Standing" : orderType = "Holding"

  

  useEffect(() => {
    orderTypeWhole ? setCustomerGroup(customers) : setCustomerGroup(createRetailOrderCustomers(orders))
  },[ customers, orderTypeWhole, orders ])


  useEffect(() => {
    if (currentCartList.length>0){
      setRoute(currentCartList[0]["route"])
    } 
    let ind=customers.findIndex(cust => cust["name"]===chosen)
    if (ind>=0){
      if (customers[ind]["zoneName"]!=="slopick" && customers[ind]["zoneName"]!=="atownpick"){
      setRoute("deliv")
      } else {
        setRoute(customers[ind]["zoneName"])
      }
    }
  },[currentCartList, chosen])


  useEffect(() => {
    if (currentCartList.length>0){
      if (currentCartList[0]["PONote"]!=="" && currentCartList[0]["PONote"] !==undefined){
        setPonote(currentCartList[0]["PONote"])
      } else {
        setPonote("")
      }
    }
  },[currentCartList])


  useEffect(() => {
    let currentOrderList = buildCurrentOrder(chosen,delivDate,orders,standing)
    if (currentCartList.length>0){
      if (currentOrderList[0]["route"]!==route){
        setModifications(true)
      } 
    } 
  },[route])

  
  useEffect(() => {
    let currentOrderList = buildCurrentOrder(chosen,delivDate,orders,standing)
    if (currentCartList.length>0){
      if (currentOrderList[0]["PONote"]!==ponote){
        setModifications(true)
      }
    }
  },[ponote])
    
  
  const handleChosen = (chosen) => {
    setChosen(chosen)
    setDelivDate(tomorrow())
  }


  const changeDate = (date) => {
    let fd = new Date(date)
    fd.setMinutes(fd.getMinutes()+fd.getTimezoneOffset()) 
    let returnDate = fd.toDateString()
    
    return returnDate
      
    }

  return (   
    <React.Fragment>
      {orderTypeWhole ?
      <React.Fragment> 
        <TitleBox>
          <Title style={cartList ? so : standList ? so : ho }>Wholesale {orderType} Order</Title>
          <DateStyle>{delivDate ? changeDate(delivDate) : ''}</DateStyle>
        </TitleBox>
      </React.Fragment> : <h2 style={standList ? so : ho }>Retail {orderType} Order</h2>}

      
        <CurrentInfo>
         
          <FulfillOptions> 

            <Dropdown id="customers" 
              value={chosen} options={customerGroup} 
              optionLabel="name" placeholder={chosen==='  ' ? "Select a Customer ..." : chosen }
              onChange={(e) => handleChosen(e.value.name)}/>     
            
            <RadioButton value="deliv" name="delivery" 
              onChange={(e) => setRoute(e.value)} checked={route === 'deliv'}/>
            <label htmlFor="delivery">Delivery</label>
            
            <RadioButton value="slopick" name="delivery"
              onChange={(e) => setRoute(e.value)} checked={route === 'slopick'} />
            <label htmlFor="pickupSLO">Pick up SLO</label>
            
            <RadioButton value="atownpick" name="delivery" 
              onChange={(e) => setRoute(e.value)} checked={route === 'atownpick'}/>
            <label htmlFor="pickupAtown">Pick up Carlton</label>

          </FulfillOptions>

          <SpecialInfo>
            <span className="p-float-label">
              <InputText id="in" size="50" value={ponote} onChange={(e) => setPonote(e.target.value)}/>
              <label htmlFor="in">{ponote==="" ? "PO#/Special Instructions..." : ""}</label>
            </span>
          </SpecialInfo>
        </CurrentInfo>
    </React.Fragment>
      
  );
}

export default CurrentOrderInfo;
