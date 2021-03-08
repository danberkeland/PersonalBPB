import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components'


import { CustomerContext, CustomerLoad } from '../../dataContexts/CustomerContext'
import { ProductsContext } from '../../dataContexts/ProductsContext'
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';
import { HoldingContext } from '../../dataContexts/HoldingContext';


import CustomerList from './Parts/CustomerList'
import Name from './Parts/Name'
import Location from './Parts/Location'
import Contact from './Parts/Contact'
import Billing from './Parts/Billing'
import Buttons from './Parts/Buttons'


const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr .66fr .66fr .66fr;
  height: 100vh;
  `


const DescripWrapper = styled.div`
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
  justify-items: start;
  align-content: flex-start;
  width: 100%;
  background: #ffffff;
  `

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px;
  padding: 5px 20px;
  `



function Customers() {

  const [ selectedCustomer, setSelectedCustomer ] = useState(null)

  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext)
  const { setProdLoaded } = useContext(ProductsContext)
  let { setHoldLoaded } = useContext(HoldingContext)
  let { setOrdersLoaded } = useContext(OrdersContext)
  let { setStandLoaded } = useContext(StandingContext)

  
  useEffect(() => {
  
    if (!customers){
        setCustLoaded(false)
    }
    setProdLoaded(true)
    setHoldLoaded(true)
    setOrdersLoaded(true)
    setStandLoaded(true)
  },[])

  
    
  return (
    <React.Fragment>
       {!custLoaded ? <CustomerLoad /> : ''}
      <MainWrapper>
        <CustomerList selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
        {selectedCustomer && 
        <React.Fragment>

          <DescripWrapper>
            <GroupBox id="Name">
              <Name selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
            </GroupBox>
      
            <GroupBox id="Location">
              <Location selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
            </GroupBox>
          </DescripWrapper>


          <DescripWrapper>
            <GroupBox id="Contact">
              <Contact selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
            </GroupBox>
            
            <GroupBox id="Billing"> 
              <Billing selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
            </GroupBox>
          </DescripWrapper>
        
          </React.Fragment>
      }

          <DescripWrapper>
            <Buttons selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
          </DescripWrapper>

        
      </MainWrapper>
    </React.Fragment>         
  );
}

export default Customers;
