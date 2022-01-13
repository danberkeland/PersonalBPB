import React, { useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { RadioButton } from "primereact/radiobutton";

import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";

const clonedeep = require("lodash.clonedeep");

const RouteSelect = () => {
  const { setModifications, cartList, orderTypeWhole } =
    useContext(ToggleContext);

  const {
    chosen,
    route,
    setRoute,
    delivDate,
    currentCartList,
    database,
    setDatabase,
    customerGroup,
  } = useContext(CurrentDataContext);

  const [products, customers, routes, standing, orders] = database;

  useEffect(() => {
    setRoute("atownpick");
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
              console.log("neither");
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
    setModifications(true);
  };

  return (
    <React.Fragment>
      {orderTypeWhole ? (
        <React.Fragment>
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
        </React.Fragment>
      ) : (
        ""
      )}

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
    </React.Fragment>
  );
};

export default RouteSelect;
