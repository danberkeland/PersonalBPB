import React, { useState, useContext, useEffect } from "react";

import TitleBox from "./CurrentOrderInfoParts/TitleBox";
import CustomerGroup from "./CurrentOrderInfoParts/CustomerGroup";
import RouteSelect from "./CurrentOrderInfoParts/RouteSelect";
import PONote from "./CurrentOrderInfoParts/PONote";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { ToggleContext } from "../../../dataContexts/ToggleContext";
import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";

import styled from "styled-components";
import { convertDatetoBPBDate } from "../../../helpers/dateTimeHelpers";

const clonedeep = require("lodash.clonedeep");

const CurrentInfo = styled.div`
  width: 100%;
  display: grid;
  margin: 10px 0;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 10px;
  background-color: lightgrey;
`;

const SpecialInfo = styled.div`
  width: 100%;
  display: flex;
  margin: 0px 10px 10px 10px;
`;

const FulfillOptions = styled.div`
  display: grid;
  grid-template-columns: 2fr .25fr 1fr .25fr 1fr .25fr 1fr;
  margin: 10px;
  align-items: center;
  justify-items: left;
`;

const FulfillOptionsPhone = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin: 10px;
  align-items: center;
  justify-items: left;
`;

const CurrentOrderInfo = () => {
  
  const { largeScreen, customerGroup, setCustomerGroup, authType, database, setDatabase, chosen, delivDate, route, currentCartList } =
    useContext(CurrentDataContext);

  const { setModifications, cartList } = useContext(ToggleContext);

  const [alignment, setAlignment] = useState();

  useEffect(() => {
    if (customerGroup) {
      for (let cust of customerGroup) {
        if (cust["custName"] === chosen) {
          switch (cust["zoneName"]) {
            case "slopick":
              setAlignment("slopick");
              break;
            case "atownpick":
              setAlignment("atownpick");
              break;
            default:
              setAlignment("deliv");
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
              setAlignment("slopick");
              break;
            case "atownpick":
              setAlignment("atownpick");
              break;
            default:
              try{
                let ind = customers.findIndex(custo => custo.custName === chosen)
              setAlignment(customers[ind].zoneName)
              } catch {
                setAlignment("atownpick")
              }
              
          }
        }
      }
    }
  }, [chosen, delivDate, customerGroup, currentCartList]);


  const handleChange = (e, newAlignment) => {
   
    if (
      newAlignment !== "deliv" &&
      newAlignment !== "slopick" &&
      newAlignment !== "atownpick"
    ) {
      newAlignment = "deliv";
    }
    setAlignment(newAlignment);
    let ordToMod = clonedeep(orders);

    for (let ord of ordToMod) {
      if (
        ord.custName === chosen &&
        ord.delivDate === convertDatetoBPBDate(delivDate)
      ) {
        ord.route = newAlignment;
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

  const [products, customers, routes, standing, orders] = database;

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  
  return (
    <React.Fragment>
      {largeScreen ? <TitleBox /> : ""}

      <CurrentInfo>
        {largeScreen ? (
          <FulfillOptions>
            <CustomerGroup
              
            />
            {cartList ? (
              <RouteSelect
                database={database}
                setDatabase={setDatabase}
                customerGroup={customerGroup}
              />
            ) : (
              ""
            )}
          </FulfillOptions>
        ) : (
          <FulfillOptionsPhone>
            {cartList ? (
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton value="deliv">Delivery</ToggleButton>
                <ToggleButton value="slopick">SLO Pickup</ToggleButton>
                <ToggleButton value="atownpick">Atown Pickup</ToggleButton>
              </ToggleButtonGroup>
            ) : (
              ""
            )}
          </FulfillOptionsPhone>
        )}

        <SpecialInfo>
          {cartList ? (
            <PONote database={database} setDatabase={setDatabase} />
          ) : (
            ""
          )}
        </SpecialInfo>
      </CurrentInfo>
    </React.Fragment>
  );
};

export default CurrentOrderInfo;