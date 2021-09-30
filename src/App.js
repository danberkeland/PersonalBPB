import React, { useEffect, useState, useContext } from "react";
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";

import { CustomerProvider } from "./dataContexts/CustomerContext";
import { OrdersProvider } from "./dataContexts/OrdersContext";
import { ProductsProvider } from "./dataContexts/ProductsContext";
import { StandingProvider } from "./dataContexts/StandingContext";
import { HoldingProvider } from "./dataContexts/HoldingContext";
import { CurrentDataProvider } from "./dataContexts/CurrentDataContext";
import { ToggleContext, ToggleProvider } from "./dataContexts/ToggleContext";
import { RoutesProvider } from "./dataContexts/RoutesContext";



import AppRoutes from "./AppRoutes";
import CustomApp from "./CustomApp";
import Nav from "./Nav";

import styled from "styled-components";

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
                      <BodyLock><AppRoutes /></BodyLock>
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
