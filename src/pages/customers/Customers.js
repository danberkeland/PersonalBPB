import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { CustomerContext, CustomerLoad } from '../../dataContexts/CustomerContext'
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listCustomers } from '../../graphql/queries';




function Customers() {

  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext)

  const [ cust, setCust ] =useState([])

  useEffect(() => {
    fetchCustomers()
  },[])

  const fetchCustomers = async () => {
    try{
      const custData = await API.graphql(graphqlOperation(listCustomers))
      const custList = custData.data.listCustomers.items;
      setCust(custList)
    } catch (error){
      console.log('error on fetching Cust List', error)
    }
  }


  const MainWrapper = styled.div`
  font-family: 'Montserrat', sans-serif;
  margin: auto;
  width: 100%;
  height: 100%;
  background: #ffffff;
  `

  return (
    <React.Fragment>
        <MainWrapper>
          <DataTable value={cust} className="p-datatable-striped" selectionMode="single" dataKey="id">
            <Column field="custName" header="Customer"sortable filter filterPlaceholder="Search by name"></Column>
            <Column field="nickName" header="Nickname"sortable filter filterPlaceholder="Search by nickname"></Column>
          </DataTable>
      </MainWrapper> 
    </React.Fragment>         
  );
}

export default Customers;
