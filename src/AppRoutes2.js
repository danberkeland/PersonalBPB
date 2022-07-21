import React, { useEffect, useContext } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Loader from "./Loader";

import TestComponent from "./pages/testComponent/testComponent";
import Remap from "./pages/Remap";
import CustomerTestPage from "./CustomerTestPage/CustomerTestPage";
import { CurrentDataContext } from "./dataContexts/CurrentDataContext";
import { ToggleContext } from "./dataContexts/ToggleContext";

function Blank() {
  const { setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    setIsLoading(false);
  });

  return <div></div>;
}

function AppRoutes2({ authType, userNum }) {
  const { setCustomerGroup, database, setAuthType, setLargeScreen } =
    useContext(CurrentDataContext);

  const [products, customers, routes, standing, orders] = database;

  useEffect(() => {
    setAuthType(authType);
  });

  useEffect(() => {
    window.addEventListener("resize", () =>
      setLargeScreen(window.innerWidth > 620 ? true : false)
    );
  });

  useEffect(() => {
    setCustomerGroup(customers);
  }, []);

  return (
    <Router>
      <Loader />

      <div className="bigPicture">
        <Switch>
          <Route path="/settings/RemapDatabase" component={Remap} />
          <Route path="/customerTestPage" component={CustomerTestPage} />

          <Route path="/" component={Blank} />

          <Route path="/test" exact component={TestComponent} />
        </Switch>
      </div>
    </Router>
  );
}

export default AppRoutes2;
