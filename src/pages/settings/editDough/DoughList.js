import React, { useEffect, useContext } from "react";

import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { fetchDoughs, fetchDoughComponents } from "./InfoParts/utils"

import styled from "styled-components";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScrollPanel } from "primereact/scrollpanel";

const ListWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  align-items: flex-start;
  margin: auto;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

const DoughList = ({
  selectedDough,
  setSelectedDough,
  doughs,
  setDoughs,
  doughComponents,
  setDoughComponents,
  isReload,
  setIsReload,
  setIsModified
}) => {
  let { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    setIsLoading(true);
    fetchDoughs(setDoughs);
    setIsLoading(false);
  }, [isReload]);

  useEffect(() => {
    setIsLoading(true);
    fetchDoughComponents(setDoughComponents);
    setIsLoading(false);
  }, [isReload]);


  const handleSelection = (e) => {
    setSelectedDough(e.value);
    setIsModified(false)
  };

  return (
    <ListWrapper>
      <ScrollPanel style={{ width: "100%", height: "100vh" }}>
        {doughs && (
          <DataTable
            value={doughs}
            className="p-datatable-striped"
            selection={selectedDough}
            onSelectionChange={handleSelection}
            selectionMode="single"
            dataKey="id"
          >
            <Column
              field="doughName"
              header="Doughs"
              sortable
              filter
              filterPlaceholder="Search by name"
            ></Column>
          </DataTable>
        )}
      </ScrollPanel>
    </ListWrapper>
  );
};

export default DoughList;
