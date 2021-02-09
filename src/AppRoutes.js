import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


import Ordering from './Ordering'
import Logistics from './Logistics'



function AppRoutes() {

  return (
    <Router>
      <Route path="/ordering" component={Ordering} /> 
      <Route path="/logistics" component={Logistics} />  
    </Router>        
  );
}

export default AppRoutes;
