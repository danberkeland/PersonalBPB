import React, { useContext, useEffect } from 'react';

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { CustomerContext, CustomerLoad } from '../../dataContexts/CustomerContext'




function Customers() {

  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext)

  useEffect(() => {
    if (!customers){
        setCustLoaded(false)
    }
  },[])

  const MainWrapper = styled.div`
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
          <DataTable value={customers} className="p-datatable-striped" selectionMode="single" dataKey="id">
            <Column field="name" header="Customer"sortable filter filterPlaceholder="Search by name"></Column>
            <Column field="nickname" header="Nickname"sortable filter filterPlaceholder="Search by nickname"></Column>
            <Column field="zoneName" header="Zone" sortable></Column>
            <Column field="email" header="Email"></Column>
            <Column field="phone" header="Phone"></Column>
          </DataTable>
      </MainWrapper> 
    </React.Fragment>         
  );
}

export default Customers;
