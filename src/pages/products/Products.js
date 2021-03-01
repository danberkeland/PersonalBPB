import React, { useContext, useEffect } from 'react';

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { ProductsContext, ProductsLoad } from '../../dataContexts/ProductsContext'




function Products() {

  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext)

  useEffect(() => {
    if (!products){
        setProdLoaded(false)
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
      {!prodLoaded ? <ProductsLoad /> : ''}
        <MainWrapper>
          <DataTable value={products} className="p-datatable-striped" selectionMode="single" dataKey="id">
            <Column field="name" header="Product"sortable filter filterPlaceholder="Search by name"></Column>
            <Column field="nickName" header="Nickname"sortable filter filterPlaceholder="Search by nickname"></Column>
            <Column field="packSize" header="Pack Size" sortable></Column>
            <Column field="doughType" header="Dough Type" sortable></Column>
          </DataTable>
      </MainWrapper> 
    </React.Fragment>         
  );
}

export default Products;
