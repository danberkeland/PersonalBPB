import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


import Ordering from './Ordering'
import Logistics from './Logistics'
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
      </div>
    </Router>        
  );
}

export default AppRoutes;
