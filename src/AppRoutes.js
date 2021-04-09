import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'



import Ordering from './pages/ordering/Ordering'

import EditRoutes from './pages/settings/editRoutes/editRoutes'
import EditZones from './pages/settings/editZones/editZones'
import BPBS from './BPBS'
import BPBN from './BPBN'
import Croix from './Croix'
import Customers from './pages/customers/Customers'
import Products from './pages/products/Products'
import ByRoute from './pages/logistics/ByRoute/ByRoute'
import ByProduct from './pages/logistics/ByProduct/ByProduct'
import Billing from './pages/billing/Billing'
import Admin from './Admin'
import Loader from './Loader'
import BPBNBaker1 from './pages/BPBNProd/BPBNBaker1';
import BPBNBaker2 from './pages/BPBNProd/BPBNBaker2';
import BPBNBuckets from './pages/BPBNProd/BPBNBuckets';
import BPBNSetOut from './pages/BPBNProd/BPBNSetOut';
import BPBNCounts from './pages/EODCounts/BPBNCounts';
import DoughCalc from './pages/doughCalc/doughCalc';


function AppRoutes() {

  return (
    <Router>
      <Loader />
      <div className="bigPicture">
        <Switch>
          <Route path="/ordering" component={Ordering} /> 
          <Route path="/logistics/byRoute" component={ByRoute} />  
          <Route path="/logistics/byProduct" component={ByProduct} />  
          <Route path="/settings/editRoutes" component={EditRoutes} />
          <Route path="/settings/editZones" component={EditZones} />

          <Route path="/BPBNProd/BPBNBaker1" component={BPBNBaker1} />
          <Route path="/BPBNProd/BPBNBaker2" component={BPBNBaker2} />
          <Route path="/BPBNProd/Buckets" component={BPBNBuckets} />
          <Route path="/BPBNProd/BPBNSetOut" component={BPBNSetOut} />
          <Route path="/EODCounts/BPBNCounts" component={BPBNCounts} />
          <Route path="/doughCalc/doughCalc" component={DoughCalc} />


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
