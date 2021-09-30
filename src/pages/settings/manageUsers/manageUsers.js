import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import { CustomerLoad, CustomerContext } from "../../../dataContexts/CustomerContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";

import UserList from "./UserList";
import Info from "./Info";
import Buttons from "./Buttons";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr 1fr 0.25fr;
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
  const [selectedUser, setSelectedUser] = useState();
  const [users, setUsers] = useState(null);
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);

  const { custLoaded, customers, setCustLoaded } = useContext(CustomerContext);
  const { setProdLoaded } = useContext(ProductsContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  useEffect(() => {
    if (!customers) {
      setCustLoaded(false);
    }
    setProdLoaded(true);
    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  return (
    <React.Fragment>
      {!custLoaded ? <CustomerLoad /> : ""}
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
                  source={source}
                  setSource={setSource}
                  target={target}
                  setTarget={setTarget}
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
            target={target}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}
export default EditZones;
