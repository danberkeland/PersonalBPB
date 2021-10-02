import React, { useContext, useEffect,useState } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { RadioButton } from "primereact/radiobutton";

import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";

const clonedeep = require("lodash.clonedeep");

const RouteSelect = ({ database, setDatabase, customerGroup }) => {
  const [products, customers, routes, standing, orders] = database;

  const { setModifications, cartList } = useContext(ToggleContext);

  const {
    chosen,
    route,
    setRoute,
    delivDate,
    currentCartList,
    setCurrentCartList,
  } = useContext(CurrentDataContext);

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

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
            ord.custName === chosen &&
            ord.delivDate === convertDatetoBPBDate(delivDate) &&
            Number(ord.qty > 0)
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
    let ordToMod = clonedeep(orders);

    for (let ord of ordToMod) {
      if (
        ord.custName === chosen &&
        ord.delivDate === convertDatetoBPBDate(delivDate)
      ) {
        ord.route = e;
      }

      if (
        ordToMod.filter(
          (ord) =>
            ord.custName === chosen &&
            ord.delivDate === convertDatetoBPBDate(delivDate)
        ).length === 0
      ) {
        for (let curr of currentCartList) {
          curr.route = route;
          ordToMod.push(curr);
        }
      }
    }

    let DBToMod = clonedeep(database);
    DBToMod[4] = ordToMod;
    setDatabase(DBToMod);
    setModifications(true)
    
  };

  return (
    <div>
      <RadioButton
        value="deliv"
        name="delivery"
        onChange={(e) => handleSetRoute(e.value)}
        checked={route === "deliv"}
        disabled={
          currentCartList.length !== 0 || cartList === true ? false : true
        }
      />
      <label htmlFor="delivery">Delivery</label>
      <RadioButton
        value="slopick"
        name="delivery"
        onChange={(e) => handleSetRoute(e.value)}
        checked={route === "slopick"}
        disabled={
          currentCartList.length !== 0 || cartList === true ? false : true
        }
      />
      <label htmlFor="pickupSLO">Pick up SLO</label>

      <RadioButton
        value="atownpick"
        name="delivery"
        onChange={(e) => handleSetRoute(e.value)}
        checked={route === "atownpick"}
        disabled={
          currentCartList.length !== 0 || cartList === true ? false : true
        }
      />
      <label htmlFor="pickupAtown">Pick up Carlton</label>
    </div>
  );
};

export default RouteSelect;
