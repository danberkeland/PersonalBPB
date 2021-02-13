import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


import Ordering from './Ordering'
import Logistics from './Logistics'
import BPBS from './BPBS'
import BPBN from './BPBN'
import Croix from './Croix'
import Customers from './Customers'
import Products from './Products'
import Billing from './Billing'
import Admin from './Admin'

import Nav from './Nav'



function AppRoutes() {

  return (
    <Router>
      <div className="Nav">
      <Nav />
      </div>
      <div className="bigPicture">
        <Route path="/ordering" component={Ordering} /> 
        <Route path="/logistics" component={Logistics} />  
        <Route path="/bpbs" component={BPBS} />
        <Route path="/bpbn" component={BPBN} />
        <Route path="/croix" component={Croix} />
        <Route path="/products" component={Products} />
        <Route path="/customers" component={Customers} />
        <Route path="/billing" component={Billing} />
        <Route path="/admin" component={Admin} />

      </div>
    </Router>        
  );
}

export default AppRoutes;
