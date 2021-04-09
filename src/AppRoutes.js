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
import BPBSWhatToMake from './pages/BPBSProd/BPBSWhatToMake';
import BPBSMixPocket from './pages/BPBSProd/BPBSMixPocket';
import CroixToMake from './pages/BPBSProd/CroixToMake';
import BPBSCounts from './pages/EODCounts/BPBSCounts';
import AMPastry from './pages/logistics/AMPastry';
import NorthLists from './pages/logistics/NorthLists';
import RetailBags from './pages/logistics/RetailBags';
import EditDough from './pages/settings/editDough/editDough';


function AppRoutes() {

  return (
    <Router>
      <Loader />
      <div className="bigPicture">
        <Switch>
          <Route path="/ordering" component={Ordering} /> 
          <Route path="/logistics/byRoute" component={ByRoute} />  
          <Route path="/logistics/byProduct" component={ByProduct} />
          <Route path="/logistics/AMPastry" component={AMPastry} />
          <Route path="/logistics/NorthLists" component={NorthLists} />
          <Route path="/logistics/RetailBags" component={RetailBags} /> 



          <Route path="/settings/editRoutes" component={EditRoutes} />
          <Route path="/settings/editZones" component={EditZones} />
          <Route path="/settings/editDough" component={EditDough} />

          <Route path="/BPBNProd/BPBNBaker1" component={BPBNBaker1} />
          <Route path="/BPBNProd/BPBNBaker2" component={BPBNBaker2} />
          <Route path="/BPBNProd/Buckets" component={BPBNBuckets} />
          <Route path="/BPBNProd/BPBNSetOut" component={BPBNSetOut} />
          <Route path="/EODCounts/BPBNCounts" component={BPBNCounts} />
          <Route path="/doughCalc/doughCalc" component={DoughCalc} />

          <Route path="/BPBSProd/BPBSWhatToMake" component={BPBSWhatToMake} />
          <Route path="/BPBSProd/BPBSMixPocket" component={BPBSMixPocket} />
          <Route path="/BPBSProd/CroixToMake" component={CroixToMake} />
          <Route path="/BPBSProd/BPBNSetOut" component={BPBNSetOut} />
          <Route path="/EODCounts/BPBSCounts" component={BPBSCounts} />
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
