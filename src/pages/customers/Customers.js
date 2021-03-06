import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScrollPanel } from 'primereact/scrollpanel';

import { CustomerContext, CustomerLoad } from '../../dataContexts/CustomerContext'
import { ProductsContext } from '../../dataContexts/ProductsContext'
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';
import { HoldingContext } from '../../dataContexts/HoldingContext';





function Customers() {

  const [ selectedCustomer, setSelectedCustomer ] = useState(null)

  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext)
  const { setProdLoaded } = useContext(ProductsContext)
  let { setHoldLoaded } = useContext(HoldingContext)
  let { setOrdersLoaded } = useContext(OrdersContext)
  let { setStandLoaded } = useContext(StandingContext)

  

  const handleSelection = e => {
    setSelectedCustomer(e.value)
    console.log(e.value)
  }


  useEffect(() => {
  
    if (!customers){
        setCustLoaded(false)
    }
    setProdLoaded(true)
    setHoldLoaded(true)
    setOrdersLoaded(true)
    setStandLoaded(true)
  },[])

  const MainWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    `


  const ListWrapper = styled.div`
    font-family: 'Montserrat', sans-serif;
    margin: auto;
    width: 100%;
    height: 100%;
    background: #ffffff;
    `

  
  return (
    <React.Fragment>
       {!custLoaded ? <CustomerLoad /> : ''}
      <MainWrapper>
        <ListWrapper>
         
          
         <ScrollPanel style={{ width: '100%', height: '100vh' }}>
          <DataTable value={customers} className="p-datatable-striped" 
            selection={selectedCustomer} onSelectionChange={handleSelection} selectionMode="single" dataKey="id">
            <Column field="custName" header="Customer" sortable filter filterPlaceholder="Search by name"></Column>
            <Column field="nickName" header="Nickname" sortable filter filterPlaceholder="Search by nickname"></Column>
          </DataTable>
          </ScrollPanel>
          
          
      </ListWrapper> 
      <h1>{selectedCustomer && selectedCustomer.custName}</h1>
    </MainWrapper>
    </React.Fragment>         
  );
}

export default Customers;
