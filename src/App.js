import React from 'react';

import { CustomerLoad, CustomerProvider } from './dataContexts/CustomerContext'
import { OrdersLoad, OrdersProvider } from './dataContexts/OrdersContext'
import { ProductsLoad, ProductsProvider } from './dataContexts/ProductsContext'
import { StandingLoad, StandingProvider } from './dataContexts/StandingContext'
import { HoldingLoad, HoldingProvider } from './dataContexts/HoldingContext'
import { CurrentDataProvider } from './dataContexts/CurrentDataContext'


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

                <StandingLoad />
                <ProductsLoad />
                <CustomerLoad />
                <OrdersLoad />
                <HoldingLoad />

                <AppRoutes />

              </CurrentDataProvider>
            </HoldingProvider>
          </StandingProvider>
        </ProductsProvider>
      </OrdersProvider>
    </CustomerProvider>
           
  );
}

export default App;
