import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'



import Ordering from './pages/ordering/Ordering'

import EditRoutes from './pages/settings/editRoutes/editRoutes'
import EditZones from './pages/settings/editZones/editZones'
import Notes from './pages/settings/notes/Notes'

import Customers from './pages/customers/Customers'
import Products from './pages/products/Products'
import ByRoute from './pages/logistics/ByRoute/ByRoute'
import ByProduct from './pages/logistics/ByProduct/ByProduct'
import Billing from './pages/billing/Billing'

import Loader from './Loader'
import BPBNBaker1 from './pages/BPBNProd/BPBNBaker1';
import BPBNBaker2 from './pages/BPBNProd/BPBNBaker2';
import BPBNBuckets from './pages/BPBNProd/BPBNBuckets';
import BPBNSetOut from './pages/BPBNProd/BPBNSetOut';
import WhoBake from './pages/BPBNProd/WhoBake';
import WhoShape from './pages/BPBNProd/WhoShape';
import EODCounts from './pages/EODCounts/EODCounts';
import DoughCalc from './pages/doughCalc/doughCalc';
import BPBSWhatToMake from './pages/BPBSProd/BPBSWhatToMake';
import BPBSMixPocket from './pages/BPBSProd/BPBSMixPocket';
import CroixToMake from './pages/BPBSProd/CroixToMake';
import AMPastry from './pages/logistics/AMPastry';
import NorthLists from './pages/logistics/NorthLists';
import RetailBags from './pages/logistics/RetailBags';
import SpecialOrders from './pages/logistics/SpecialOrders';
import EditDough from './pages/settings/editDough/editDough';
import DelivOrder from './pages/settings/delivOrder/delivOrder';
import CustProd from './pages/settings/custProd/custProd';
import ManageUsers from './pages/settings/manageUsers/manageUsers';
import TestComponent from './pages/testComponent/testComponent'


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
          <Route path="/logistics/SpecialOrders" component={SpecialOrders} /> 



          <Route path="/settings/editRoutes" component={EditRoutes} />
          <Route path="/settings/editZones" component={EditZones} />
          <Route path="/settings/editDough" component={EditDough} />
          <Route path="/settings/notes" component={Notes} />
          <Route path="/settings/delivOrder" component={DelivOrder} />
          <Route path="/settings/custProd" component={CustProd} />
          <Route path="/settings/manageUsers" component={ManageUsers} />
        

          <Route path="/BPBNProd/BPBNBaker1" component={BPBNBaker1} />
          <Route path="/BPBNProd/BPBNBaker2" component={BPBNBaker2} />
          <Route path="/BPBNProd/Buckets" component={BPBNBuckets} />
          <Route path="/BPBNProd/WhoBake" component={WhoBake} />
          <Route path="/BPBNProd/WhoShape" component={WhoShape} />
          <Route path="/doughCalc/doughCalc" component={DoughCalc} />
          <Route path="/BPBNProd/BPBNSetOut" render={(props)=><BPBNSetOut {...props} loc={'Carlton'} />} />

          <Route path="/BPBSProd/BPBSWhatToMake" component={BPBSWhatToMake} />
          <Route path="/BPBSProd/BPBSMixPocket" component={BPBSMixPocket} />
          <Route path="/BPBSProd/CroixToMake" component={CroixToMake} />
          <Route path="/BPBSProd/BPBSSetOut" render={(props)=><BPBNSetOut {...props} loc={'Prado'} />} />
          <Route path="/EODCounts/BPBSCounts" render={(props)=><EODCounts {...props} loc={'Prado'} />} />
          <Route path="/doughCalc/doughCalc" component={DoughCalc} />


         
          <Route path="/products" component={Products} />
          <Route path="/customers" component={Customers} />
          <Route path="/billing" component={Billing} />
         
          <Route path="/" exact component={Ordering} />

          <Route path="/test" exact component={TestComponent} />
        </Switch>
      </div>
    </Router>        
  );
}

export default AppRoutes;
