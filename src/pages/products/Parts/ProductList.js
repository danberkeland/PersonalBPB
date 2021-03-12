import React, { useContext } from "react";

import styled from "styled-components";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScrollPanel } from "primereact/scrollpanel";

import { CustomerContext } from "../../../dataContexts/CustomerContext";

const ListWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  margin: auto;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

const CustomerList = ({ selectedCustomer, setSelectedCustomer }) => {
  const { customers } = useContext(CustomerContext);

  const handleSelection = (e) => {
    setSelectedCustomer(e.value);
  };

  return (
    <React.Fragment>
      {!prodLoaded ? <ProductsLoad /> : ""}
      <MainWrapper>
        <DataTable
          value={products}
          className="p-datatable-striped"
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
      </MainWrapper>
    </React.Fragment>
  );
};

export default CustomerList;
