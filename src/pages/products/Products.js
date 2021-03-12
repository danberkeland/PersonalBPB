import React, { useContext, useEffect } from 'react';

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { ProductsContext, ProductsLoad } from '../../dataContexts/ProductsContext'
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';
import { HoldingContext } from '../../dataContexts/HoldingContext';




function Products() {

  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext)
  let { setCustLoaded } = useContext(CustomerContext)
  let { setHoldLoaded } = useContext(HoldingContext)
  let { setOrdersLoaded } = useContext(OrdersContext)
  let { setStandLoaded } = useContext(StandingContext)

  useEffect(() => {
  
    if (!products){
        setProdLoaded(false)
    }
    setCustLoaded(true)
    setHoldLoaded(true)
    setOrdersLoaded(true)
    setStandLoaded(true)
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
      {!prodLoaded ? <ProductsLoad /> : ''}
        <MainWrapper>
          <DataTable value={products} className="p-datatable-striped" selectionMode="single" dataKey="id">
            <Column field="prodName" header="Product"sortable filter filterPlaceholder="Search by name"></Column>
            <Column field="nickName" header="Nickname"sortable filter filterPlaceholder="Search by nickname"></Column>
            
          </DataTable>
      </MainWrapper> 
    </React.Fragment>         
  );
}

export default Products;
