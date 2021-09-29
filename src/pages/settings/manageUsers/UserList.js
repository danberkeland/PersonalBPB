import React, { useEffect, useContext } from "react";

import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { listAuthSettingss } from "../../../graphql/queries";

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

const UserList = ({ selectedUser, setSelectedUser, users, setUsers }) => {
  let { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    setIsLoading(true);
    fetchUsers();
    setIsLoading(false);
  }, [users]);

  const fetchUsers = async () => {
    try {
      const userData = await API.graphql(
        graphqlOperation(listAuthSettingss, {
          limit: "1000",
        })
      );
      const userList = userData.data.listAuthSettingss.items;
      sortAtoZDataByIndex(userList, "businessName");
      let noDelete = userList.filter((user) => user["_deleted"] !== true);

      setUsers(noDelete);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  const handleSelection = (e) => {
    setSelectedUser(e.value);
  };

  return (
    <ListWrapper>
      <ScrollPanel style={{ width: "100%", height: "100vh" }}>
        {users && (
          <DataTable
            value={users}
            className="p-datatable-striped"
            selection={selectedUser}
            onSelectionChange={handleSelection}
            selectionMode="single"
            dataKey="id"
          >
            <Column
              field="businessName"
              header="Business Name"
              sortable
              filter
              filterPlaceholder="Search by name"
            ></Column>
            <Column
              field="firstName"
              header="First"
            ></Column>
            <Column
              field="lastName"
              header="Last"
              
            ></Column>
          </DataTable>
        )}
      </ScrollPanel>
    </ListWrapper>
  );
};

export default UserList;
