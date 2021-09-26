import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'



function CustomApp({ chosen }) {

  return (
    <div>{chosen} was here.</div>
  );
}

export default CustomApp;
