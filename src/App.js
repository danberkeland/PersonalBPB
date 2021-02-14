import React from 'react';

import { CustomerProvider } from './dataContexts/CustomerContext'
import { OrdersProvider } from './dataContexts/OrdersContext'
import { ProductsProvider } from './dataContexts/ProductsContext'
import { StandingProvider } from './dataContexts/StandingContext'
import { HoldingProvider } from './dataContexts/HoldingContext'
import { CurrentDataProvider } from './dataContexts/CurrentDataContext'
import { ToggleProvider } from './dataContexts/ToggleContext'
import { RoutesProvider } from './dataContexts/RoutesContext'


import AppRoutes from './AppRoutes'


import './App.css';


function App() {

  return (
    
    <CustomerProvider>
      <OrdersProvider>
        <ProductsProvider>
          <StandingProvider>
            <HoldingProvider>
              <CurrentDataProvider>
                <ToggleProvider>
                  <RoutesProvider>

                    <AppRoutes />

                  </RoutesProvider>
                </ToggleProvider>
              </CurrentDataProvider>
            </HoldingProvider>
          </StandingProvider>
        </ProductsProvider>
      </OrdersProvider>
    </CustomerProvider>
           
  );
}

export default App;
