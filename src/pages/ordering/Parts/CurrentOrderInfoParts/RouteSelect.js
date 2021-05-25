import React, { useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { RadioButton } from "primereact/radiobutton";

import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";

const clonedeep = require("lodash.clonedeep");

const RouteSelect = ({ database, setDatabase, customerGroup }) => {
  const [products, customers, routes, standing, orders] = database;

  const { setModifications } = useContext(ToggleContext);

  const { chosen, route, setRoute, delivDate, currentCartList, setCurrentCartList } =
    useContext(CurrentDataContext);

  useEffect(() => {
    if (customerGroup) {
      for (let cust of customerGroup) {
        if (cust["custName"] === chosen) {
          switch (cust["zoneName"]) {
            case "slopick":
              setRoute("slopick");
              break;
            case "atownpick":
              setRoute("atownpick");
              break;
            default:
              setRoute("deliv");
          }
        }
      }
      if (currentCartList) {
        let orderCheck = currentCartList.filter(
          (ord) =>
            ord["custName"] === chosen &&
            ord["delivDate"] === convertDatetoBPBDate(delivDate)
        );

        if (orderCheck.length > 0) {
          switch (orderCheck[0].route) {
            case "slopick":
              setRoute("slopick");
              break;
            case "atownpick":
              setRoute("atownpick");
              break;
            default:
              setRoute("deliv");
          }
        }
      }
    }
  }, [chosen, delivDate, customerGroup, currentCartList]);

  const handleSetRoute = (e) => {
    let ordToMod = clonedeep(orders)
    
    for (let ord of ordToMod){
      if (ord.custName === chosen && ord.delivDate === convertDatetoBPBDate(delivDate)){
        ord.route = e
      }
    }
    let DBToMod = clonedeep(database)
    DBToMod[4] = ordToMod
    setDatabase(DBToMod)
    setModifications(true);
  };

  return (
    <React.Fragment>
      <RadioButton
        value="deliv"
        name="delivery"
        onChange={(e) => handleSetRoute(e.value)}
        checked={route === "deliv"}
      />
      <label htmlFor="delivery">Delivery</label>
      <RadioButton
        value="slopick"
        name="delivery"
        onChange={(e) => handleSetRoute(e.value)}
        checked={route === "slopick"}
      />
      <label htmlFor="pickupSLO">Pick up SLO</label>

      <RadioButton
        value="atownpick"
        name="delivery"
        onChange={(e) => handleSetRoute(e.value)}
        checked={route === "atownpick"}
      />
      <label htmlFor="pickupAtown">Pick up Carlton</label>
    </React.Fragment>
  );
};

export default RouteSelect;
