import React, { useEffect, useContext } from "react";

import styled from "styled-components";

import { ToggleContext } from "../../../../dataContexts/ToggleContext";
import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScrollPanel } from "primereact/scrollpanel";

import { listRoutes } from "../../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../../../../helpers/sortDataHelpers";

const ListWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  margin: auto;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

const RouteList = ({ routes, setRoutes }) => {
  let { setIsLoading } = useContext(ToggleContext);
  const { delivDate, route, setRoute } = useContext(CurrentDataContext)

  useEffect(() => {
    setIsLoading(true);
    fetchRoutes();
    setIsLoading(false);
  }, [routes]);

  const fetchRoutes = async () => {
    try {
      const routeData = await API.graphql(
        graphqlOperation(listRoutes, {
          limit: "50",
        })
      );
      const routeList = routeData.data.listRoutes.items;
      sortAtoZDataByIndex(routeList, "routeStart");
      let noDelete = routeList.filter((route) => route["_deleted"] !== true);

      setRoutes(noDelete);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  const handleSelection = (e) => {
   
    setRoute(e.value.routeName)
  };

  return (
    <ListWrapper>
      <ScrollPanel style={{ width: "100%", height: "100vh" }}>
        <DataTable
          value={routes}
          className="p-datatable-striped"
          selectionMode="single"
          onSelectionChange={handleSelection}
          dataKey="id"
        >
          <Column field="routeName" header="Routes"></Column>
        </DataTable>
      </ScrollPanel>
    </ListWrapper>
  );
};

export default RouteList;
