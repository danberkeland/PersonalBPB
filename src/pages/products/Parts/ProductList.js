import React, { useContext } from "react";

import styled from "styled-components";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScrollPanel } from "primereact/scrollpanel";

import { ProductsContext } from "../../../dataContexts/ProductsContext";

const ListWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  margin: auto;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

const ProductList = ({ selectedProduct, setSelectedProduct }) => {
  const { products } = useContext(ProductsContext);

  const handleSelection = (e) => {
    
    setSelectedProduct(e.value);
  };

  return (
    <ListWrapper>
      <ScrollPanel style={{ width: "100%", height: "100vh" }}>
        <DataTable
          value={products}
          className="p-datatable-striped"
          selection={selectedProduct}
          onSelectionChange={handleSelection}
          selectionMode="single"
          dataKey="id"
        >
          <Column
            field="prodName"
            header="Product"
            sortable
            filter
            filterPlaceholder="Search by name"
          ></Column>
          <Column
            field="nickName"
            header="Nickname"
            sortable
            filter
            filterPlaceholder="Search by nickname"
          ></Column>
        </DataTable>
      </ScrollPanel>
    </ListWrapper>
  );
};

export default ProductList;
