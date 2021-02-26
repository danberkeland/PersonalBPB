import React, { useContext, useEffect, useState } from 'react';

import { CustomerContext } from '../../../dataContexts/CustomerContext';
import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { ToggleContext } from '../../../dataContexts/ToggleContext';

import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';



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
    grid-template-columns: 3fr 1fr 3fr 1fr 3fr 1fr 3fr;
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

  const {cartList, standList, orderTypeWhole } = useContext(ToggleContext)
  const { customers } = useContext(CustomerContext)
  const { chosen, ponote, setPonote, setChosen, delivDate, currentCartList } = useContext(CurrentDataContext)

  const [ customerGroup, setCustomerGroup ] = useState(customers)
  const [ delivStatus, setDelivStatus ] = useState('slopick')


  let orderType
  cartList ? orderType = "Cart" : standList ? orderType = "Standing" : orderType = "Holding"

  

    useEffect(() => {
      setCustomerGroup(customers)
    },[ customers ])


    useEffect(() => {
      setPonote('')
      if (currentCartList.length>0){
        setDelivStatus(currentCartList[0]["route"])
        if (currentCartList[0]["ponote"]!=="na" && currentCartList[0]["ponote"] !==undefined){
          setPonote(currentCartList[0]["ponote"])
        } else {
          setPonote("")
        }
      }
    }, [currentCartList, chosen, delivDate])

    
    const changeDate = (date) => {
      let currentDate = new Date(date);
      var fd = currentDate.toDateString();
      return fd;
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
              optionLabel="name" placeholder="Select a customer"
              onChange={(e) => setChosen(e.value)}/>     
            
            <RadioButton value="deliv" name="delivery" 
              onChange={(e) => setDelivStatus(e.value)} checked={delivStatus === 'deliv'}/>
            <label htmlFor="delivery">Delivery</label>
            
            <RadioButton value="slopick" name="delivery"
              onChange={(e) => setDelivStatus(e.value)} checked={delivStatus === 'slopick'} />
            <label htmlFor="pickupSLO">Pick up SLO</label>
            
            <RadioButton value="atownpick" name="delivery" 
              onChange={(e) => setDelivStatus(e.value)} checked={delivStatus === 'atownpick'}/>
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
