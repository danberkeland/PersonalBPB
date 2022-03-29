import React, { useEffect, useState, useContext } from "react";
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";

import { listAuthSettingss } from "./graphql/queries";
import { updateAuthSettings } from "./graphql/mutations";

import { CustomerProvider } from "./dataContexts/CustomerContext";
import { OrdersProvider } from "./dataContexts/OrdersContext";
import { ProductsProvider } from "./dataContexts/ProductsContext";
import { StandingProvider } from "./dataContexts/StandingContext";
import { HoldingProvider } from "./dataContexts/HoldingContext";
import { CurrentDataProvider } from "./dataContexts/CurrentDataContext";
import { ToggleProvider } from "./dataContexts/ToggleContext";
import { RoutesProvider } from "./dataContexts/RoutesContext";

import AppRoutes from "./AppRoutes";
import NavCustomers from "./NavCustomers";
import Nav from "./Nav";

import styled from "styled-components";
import { sortAtoZDataByIndex } from "./helpers/sortDataHelpers";

const clonedeep = require("lodash.clonedeep");

const NavLock = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 100;
`;

const BodyLock = styled.div`
  position: relative;
  width: 100%;
  top: 100px;
`;

Amplify.configure(awsconfig);

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [authType, setAuthType] = useState();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let currentUser = Auth.currentAuthenticatedUser().then((use) =>
      setUser(use.attributes.sub)
    );
  }, []);

  useEffect(() => {
    let copyOfUsers = clonedeep(users);
    console.log("copyOfUsers",copyOfUsers)
    let id;
    let authT
    console.log(copyOfUsers);
    if (user) {
      for (let cop of copyOfUsers) {
        if (cop.sub === user) {
          id = cop.id;
          authT = cop.authType
        }
      }
    }

    let updateDetails = {
      id: id,
      tempPassword: null,
      tempUsername: null,
    };
    setAuthType(authT)
    console.log("AuthType:",authType)
    console.log("User:",user)
    updateTemps(updateDetails);
  }, [users, user]);

  const updateTemps = async (details) => {
    try {
      const userData = await API.graphql(
        graphqlOperation(updateAuthSettings, { input: { ...details } })
      );
      console.log("This worked, whatever it does")
    } catch (error) {
      console.log("error on fetching User List", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const userData = await API.graphql(
        graphqlOperation(listAuthSettingss, {
          limit: "1000",
        })
      );
      const userList = userData.data.listAuthSettingss.items;
      
      //sortAtoZDataByIndex(userList, "businessName");
      let noDelete = userList.filter((user) => user["_deleted"] !== true);

      setUsers(noDelete);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };
  return (
    <React.Fragment>
      <NavLock>
      <Nav />
      </NavLock>

      <RoutesProvider>
        <ToggleProvider>
          <CustomerProvider>
            <ProductsProvider>
              <OrdersProvider>
                <StandingProvider>
                  <HoldingProvider>
                    <CurrentDataProvider>
                      <BodyLock>
                       
                       <AppRoutes authType={authType} userNum={user}/>
                      </BodyLock>
                    </CurrentDataProvider>
                  </HoldingProvider>
                </StandingProvider>
              </OrdersProvider>
            </ProductsProvider>
          </CustomerProvider>
        </ToggleProvider>
      </RoutesProvider>
    </React.Fragment>
  );
}

export default withAuthenticator(App);
