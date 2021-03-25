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

const RouteList = ({ orderList, setRouteList, setRoute, routeList }) => {
  
  useEffect(() => {
    if (orderList){
    let rtList = orderList.map(ord => ord["route"])
    let setRtList = new Set(rtList)
    let rtListArray = Array.from(setRtList)
    rtListArray = rtListArray.map(rt => ({route: rt}))

    setRouteList(rtListArray)
  }
  },[orderList])

  const handleSelection = (e) => {
   
    setRoute(e.value.route)
  };

  return (
    <ListWrapper>
      <ScrollPanel style={{ width: "100%", height: "100vh" }}>
        <DataTable
          value={routeList}
          className="p-datatable-striped"
          selectionMode="single"
          onSelectionChange={handleSelection}
          dataKey="id"
        >
          <Column field="route" header="Routes"></Column>
        </DataTable>
      </ScrollPanel>
    </ListWrapper>
  );
};

export default RouteList;
