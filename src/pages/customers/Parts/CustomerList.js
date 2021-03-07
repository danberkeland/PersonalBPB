import React, { useContext } from 'react';

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScrollPanel } from 'primereact/scrollpanel';


import { CustomerContext } from '../../../dataContexts/CustomerContext'

const ListWrapper = styled.div`
    font-family: 'Montserrat', sans-serif;
    margin: auto;
    width: 100%;
    height: 100vh;
    background: #ffffff;
    `

const CustomerList = ({ selectedCustomer, setSelectedCustomer }) => {

    const { customers } = useContext(CustomerContext)
  

    const handleSelection = e => {
        setSelectedCustomer(e.value)
    }
  
  return (
    
        <ListWrapper>
         
          
         <ScrollPanel style={{ width: '100%', height: '100vh' }}>
          <DataTable value={customers} className="p-datatable-striped" 
            selection={selectedCustomer} onSelectionChange={handleSelection} selectionMode="single" dataKey="id">
            <Column field="custName" header="Customer" sortable filter filterPlaceholder="Search by name"></Column>
            <Column field="nickName" header="Nickname" sortable filter filterPlaceholder="Search by nickname"></Column>
          </DataTable>
          </ScrollPanel>
          
          
      </ListWrapper> 
               
  );
}

export default CustomerList;
