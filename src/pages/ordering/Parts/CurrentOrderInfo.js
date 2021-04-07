import React, { useContext, useEffect, useState } from "react";

import { CustomerContext } from "../../../dataContexts/CustomerContext";
import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";

import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";

import {
  convertDatetoBPBDate,
  tomorrow,
} from "../../../helpers/dateTimeHelpers";
import { createRetailOrderCustomers } from "../../../helpers/sortDataHelpers";

import styled from "styled-components";

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

const TitleBox = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.h2`
  padding: 0;
  margin: 10px 0;
`;
const DateStyle = styled.h4`
  padding: 0;
  color: grey;
  margin: 10px 0;
`;
const FulfillOptions = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr 3fr 1fr 3fr 1fr 3fr;
  margin: 10px;
  align-items: center;
  justify-items: left;
`;

const ho = {
  color: "red",
};

const so = {
  color: "rgb(66, 97, 201)",
};

const CurrentOrderInfo = () => {
  const {
    cartList,
    standList,
    setStandList,
    orderTypeWhole,
    setModifications,
  } = useContext(ToggleContext);

  const [orderType, setOrderType] = useState();

  const { orders } = useContext(OrdersContext);
  const { standing } = useContext(StandingContext);
  const { holding } = useContext(HoldingContext);
  const { customers } = useContext(CustomerContext);
  const {
    chosen,
    route,
    setRoute,
    ponote,
    setPonote,
    setChosen,
    delivDate,
    setDelivDate,
    currentCartList,
  } = useContext(CurrentDataContext);

  const [customerGroup, setCustomerGroup] = useState(customers);

  useEffect(() => {
    if (cartList) {
      setOrderType("Cart");
    } else {
      if (standList) {
        setOrderType("Stand");
      } else {
        setOrderType("Hold");
      }
    }
  }, [cartList, standList]);

  useEffect(() => {
    orderTypeWhole
      ? setCustomerGroup(customers)
      : setCustomerGroup(createRetailOrderCustomers(orders));
  }, [customers, orderTypeWhole, orders]);

  useEffect(() => {
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
   
    let orderCheck = orders.filter(
      (ord) => ord["custName"] === chosen && ord["delivDate"] === convertDatetoBPBDate(delivDate)
    );
    console.log(orderCheck)
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
  }, [chosen, delivDate]);

  useEffect(() => {
    setPonote("");

    let orderCheck = orders.filter(
      (ord) =>
        ord["custName"] === chosen &&
        ord["delivDate"] === convertDatetoBPBDate(delivDate)
    );
   

    if (orderCheck.length > 0) {
      setPonote(orderCheck[0]["PONote"]);
    }
  }, [chosen, delivDate]);

  const handleChosen = (chosen) => {
    setChosen(chosen);
    setDelivDate(tomorrow());
    setModifications(false)
  };

  const changeDate = (date) => {
    let fd = new Date(date);
    fd.setMinutes(fd.getMinutes() + fd.getTimezoneOffset());
    let returnDate = fd.toDateString();

    return returnDate;
  };

  const handleSetRoute = (e) => {
    setRoute(e)
    setModifications(true)
  }

  return (
    <React.Fragment>
      {orderTypeWhole ? (
        <React.Fragment>
          <TitleBox>
            <Title style={cartList ? so : standList ? so : ho}>
              Wholesale {orderType} Order
            </Title>
            <DateStyle>{delivDate ? changeDate(delivDate) : ""}</DateStyle>
          </TitleBox>
        </React.Fragment>
      ) : (
        <h2 style={standList ? so : ho}>Retail {orderType} Order</h2>
      )}

      <CurrentInfo>
        <FulfillOptions>
          <Dropdown
            id="customers"
            value={chosen}
            options={customerGroup}
            optionLabel="custName"
            placeholder={chosen === "  " ? "Select a Customer ..." : chosen}
            onChange={(e) => handleChosen(e.value.custName)}
          />

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
        </FulfillOptions>

        <SpecialInfo>
          <span className="p-float-label">
            <InputText
              id="in"
              size="50"
              value={ponote}
              onChange={(e) => setPonote(e.target.value)}
            />
            <label htmlFor="in">
              {ponote === "" ? "PO#/Special Instructions..." : ""}
            </label>
          </span>
        </SpecialInfo>
      </CurrentInfo>
    </React.Fragment>
  );
};

export default CurrentOrderInfo;
