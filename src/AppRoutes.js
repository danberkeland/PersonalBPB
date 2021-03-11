import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'



import Ordering from './pages/ordering/Ordering'
import DeliveryRouteGrid from './pages/logistics/DeliveryRouteGrid'
import DeliveryCustomerGrid from './pages/logistics/DeliveryCustomerGrid'
import DeliveryProductGrid from './pages/logistics/DeliveryProductGrid'
import EditRoutes from './pages/settings/editRoutes/editRoutes'
import EditZones from './pages/settings/editZones/editZones'
import BPBS from './BPBS'
import BPBN from './BPBN'
import Croix from './Croix'
import Customers from './pages/customers/Customers'
import Products from './pages/products/Products'
import Billing from './Billing'
import Admin from './Admin'
import Loader from './Loader'


function AppRoutes() {

  return (
    <Router>
      <Loader />
      <div className="bigPicture">
        <Switch>
          <Route path="/ordering" component={Ordering} /> 
          <Route path="/logistics/byRoute" component={DeliveryRouteGrid} />  
          <Route path="/logistics/byCustomer" component={DeliveryCustomerGrid} />  
          <Route path="/logistics/byProduct" component={DeliveryProductGrid} />  
          <Route path="/settings/editRoutes" component={EditRoutes} />
          <Route path="/settings/editZones" component={EditZones} />
          <Route path="/bpbs" component={BPBS} />
          <Route path="/bpbn" component={BPBN} />
          <Route path="/croix" component={Croix} />
          <Route path="/products" component={Products} />
          <Route path="/customers" component={Customers} />
          <Route path="/billing" component={Billing} />
          <Route path="/admin" component={Admin} />
          <Route path="/" exact component={Ordering} />
        </Switch>
      </div>
    </Router>        
  );
}

export default AppRoutes;
