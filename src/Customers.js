import React, { useContext, useEffect } from 'react';

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { CustomerContext, FullCustomerLoad } from './dataContexts/CustomerContext'




function Customers() {

  const { fullCustomer, fullCustLoaded, setFullCustLoaded } = useContext(CustomerContext)

  useEffect(() => {
    if (fullCustomer.length<1){
        setFullCustLoaded(false)
    }
  },[])

  const MainWrapper = styled.div`
  font-family: 'Montserrat', sans-serif;
  margin: auto;
  width: 90%;
  height: 90%;
  border-radius: 20px;
  background: #ffffff;
  display: grid;
  grid-template-columns: 1fr;  
  `

  return (
    <React.Fragment>
      {!fullCustLoaded ? <FullCustomerLoad /> : ''}
        <MainWrapper>
          <DataTable value={fullCustomer} className="p-datatable-striped" selectionMode="single" dataKey="id">
            <Column field="name" header="Customer"sortable filter filterPlaceholder="Search by name"></Column>
            <Column field="zoneName" header="Zone" sortable></Column>
            <Column field="email" header="Email"></Column>
            <Column field="phone" header="Phone"></Column>
          </DataTable>
      </MainWrapper> 
    </React.Fragment>         
  );
}

export default Customers;
