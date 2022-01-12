import React, { useEffect, useContext } from 'react';

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
import BPBNBaker1 from './pages/BPBNProd/BPBNBaker1_2';
import BPBNBaker1Backup from './pages/BPBNProd/BPBNBaker1Backup';
import BPBNBaker2 from './pages/BPBNProd/BPBNBaker2';
import BPBNBaker2Backup from './pages/BPBNProd/BPBNBaker2Backup';
import BPBNBuckets from './pages/BPBNProd/BPBNBuckets';
import BPBNSetOut from './pages/BPBNProd/BPBNSetOut';
import WhoBake from './pages/BPBNProd/WhoBake';
import WhoShape from './pages/BPBNProd/WhoShape';
import EODCounts from './pages/EODCounts/EODCounts';
import DoughCalc from './pages/doughCalc/doughCalc';
import BPBSWhatToMake from './pages/BPBSProd/BPBSWhatToMake';
import BPBSWhatToMakeBackup from './pages/BPBSProd/BPBSWhatToMakeBackup';
import BPBSMixPocket from './pages/BPBSProd/BPBSMixPocket';
import CroixToMake from './pages/BPBSProd/CroixToMake';
import CroixCount from './pages/BPBSProd/CroixCount';
import AMPastry from './pages/logistics/AMPastry';
import NorthLists from './pages/logistics/NorthLists';
import RetailBags from './pages/logistics/RetailBags';
import SpecialOrders from './pages/logistics/SpecialOrders';
import FreezerThaw from './pages/logistics/FreezerThaw';
import EditDough from './pages/settings/editDough/editDough';
import DelivOrder from './pages/settings/delivOrder/delivOrder';
import CustProd from './pages/settings/custProd/custProd';
import ManageUsers from './pages/settings/manageUsers/manageUsers';
import Voice from './pages/settings/voice/voice';
import TestComponent from './pages/testComponent/testComponent'
import { CurrentDataContext } from './dataContexts/CurrentDataContext';


function AppRoutes({ authType, userNum }) {

  const { setCustomerGroup, database, setAuthType,
    setLargeScreen } = useContext(CurrentDataContext)
  
  const [products, customers, routes, standing, orders] = database;

  useEffect(() => {
    setAuthType(authType)
  })
  
  useEffect(() => {
    window.addEventListener("resize", () => setLargeScreen(window.innerWidth>620 ? true : false));
  });

  useEffect(() => {
    setCustomerGroup(customers)
  },[])

  return (
    <Router>
      <Loader />
      
      <div className="bigPicture">
        <Switch>
          <Route path="/ordering" render={(props)=><Ordering {...props} userNum={userNum} authType={authType} />}/> 
          <Route path="/logistics/byRoute" component={ByRoute} />  
          <Route path="/logistics/byProduct" component={ByProduct} />
          <Route path="/logistics/AMPastry" component={AMPastry} />
          <Route path="/logistics/NorthLists" component={NorthLists} />
          <Route path="/logistics/RetailBags" component={RetailBags} /> 
          <Route path="/logistics/SpecialOrders" component={SpecialOrders} /> 
          <Route path="/logistics/FreezerThaw" component={FreezerThaw} /> 



          <Route path="/settings/editRoutes" component={EditRoutes} />
          <Route path="/settings/editZones" component={EditZones} />
          <Route path="/settings/editDough" component={EditDough} />
          <Route path="/settings/notes" component={Notes} />
          <Route path="/settings/delivOrder" component={DelivOrder} />
          <Route path="/settings/custProd" component={CustProd} />
          <Route path="/settings/manageUsers" component={ManageUsers} />
          <Route path="/settings/voice" component={Voice} />
        

          <Route path="/BPBNProd/BPBNBaker1" component={BPBNBaker1} />
          <Route path="/BPBNProd/BPBNBaker1Backup" component={BPBNBaker1Backup} />
          <Route path="/BPBNProd/BPBNBaker2" component={BPBNBaker2} />
          <Route path="/BPBNProd/BPBNBaker2Backup" component={BPBNBaker2Backup} />
          <Route path="/BPBNProd/Buckets" render={(props)=><BPBNBuckets {...props} loc={'Carlton'}/>} />
          <Route path="/BPBNProd/WhoBake" component={WhoBake} />
          <Route path="/BPBNProd/WhoShape" component={WhoShape} />
          <Route path="/doughCalc/doughCalc" component={DoughCalc} />
          <Route path="/BPBNProd/BPBNSetOut" render={(props)=><BPBNSetOut {...props} loc={'Carlton'} />} />

          <Route path="/BPBSProd/BPBSWhatToMake" component={BPBSWhatToMake} />
          <Route path="/BPBSProd/BPBSWhatToMakeBackup" component={BPBSWhatToMakeBackup} />
          <Route path="/BPBSProd/BPBSMixPocket" component={BPBSMixPocket} />
          <Route path="/BPBSProd/Buckets" render={(props)=><BPBNBuckets {...props} loc={'Prado'}/>} />
          <Route path="/BPBSProd/CroixToMake" component={CroixToMake} />
          <Route path="/BPBSProd/CroixCount" component={CroixCount} />
          <Route path="/BPBSProd/BPBSSetOut" render={(props)=><BPBNSetOut {...props} loc={'Prado'} />} />
          <Route path="/EODCounts/BPBSCounts" render={(props)=><EODCounts {...props} loc={'Prado'} />} />
          <Route path="/doughCalc/doughCalc" component={DoughCalc} />


         
          <Route path="/products" component={Products} />
          <Route path="/customers" component={Customers} />
          <Route path="/billing" render={(props)=><Billing {...props} />} />
          <Route path="/billing/:code" component={Billing} />
         
          <Route path="/" render={(props)=><Ordering {...props} userNum={userNum} authType={authType} />}/> 

          <Route path="/test" exact component={TestComponent} />
        </Switch>
      </div>
    </Router>        
  );
}

export default AppRoutes;
