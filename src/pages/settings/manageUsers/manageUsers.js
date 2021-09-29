import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import { CustomerContext } from "../../../dataContexts/CustomerContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";

import UserList from "./UserList";
import Info from "./Info";
import Buttons from "./Buttons";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
  height: 100vh;
`;

const DescripWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-direction: column;
  justify-items: start;
  align-content: flex-start;
  width: 100%;
  background: #ffffff;
`;

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

function EditZones() {
  const [selectedUser, setSelectedUser] = useState(1);
  const [users, setUsers] = useState(null);

  const { setCustLoaded } = useContext(CustomerContext);
  const { setProdLoaded } = useContext(ProductsContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  useEffect(() => {
    setCustLoaded(true);
    setProdLoaded(true);
    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  return (
    <React.Fragment>
      <MainWrapper>
        <UserList
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          users={users}
          setUsers={setUsers}
        />
        {selectedUser && (
          <React.Fragment>
            <DescripWrapper>
              <GroupBox id="Info">
                <Info
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  users={users}
                  setUsers={setUsers}
                />
              </GroupBox>
            </DescripWrapper>
          </React.Fragment>
        )}
        <DescripWrapper>
          <Buttons
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            users={users}
            setUsers={setUsers}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}
export default EditZones;
