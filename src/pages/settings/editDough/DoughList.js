import React, { useEffect, useContext } from "react";

import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { listDoughs, listDoughComponents } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";

import styled from "styled-components";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScrollPanel } from "primereact/scrollpanel";

const ListWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
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
}) => {
  let { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    setIsLoading(true);
    fetchDoughs();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchDoughComponents();
    setIsLoading(false);
  }, []);

  const fetchDoughs = async () => {
    try {
      const doughData = await API.graphql(
        graphqlOperation(listDoughs, {
          limit: "50",
        })
      );
      const doughList = doughData.data.listDoughs.items;
      sortAtoZDataByIndex(doughList, "doughName");
      let noDelete = doughList.filter((dough) => dough["_deleted"] !== true);

      setDoughs(noDelete);
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  const fetchDoughComponents = async () => {
    try {
      const doughData = await API.graphql(
        graphqlOperation(listDoughComponents, {
          limit: "50",
        })
      );
      const doughList = doughData.data.listDoughComponents.items;
      sortAtoZDataByIndex(doughList, "doughName");
      let noDelete = doughList.filter((dough) => dough["_deleted"] !== true);
        console.log(noDelete)
      setDoughComponents(noDelete);
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  const handleSelection = (e) => {
    setSelectedDough(e.value);
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
