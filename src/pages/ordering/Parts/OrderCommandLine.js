import React, { useContext } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { CustomerContext } from "../../../dataContexts/CustomerContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import {
  todayPlus,
  daysOfTheWeek,
  convertDatetoBPBDate,
} from "../../../helpers/dateTimeHelpers";
import {
  buildCurrentOrder,
  testEntryForProduct,
  createArrayofEnteredProducts,
  createOrdersToUpdate,
  buildOrdersToModify,
  addUpdatesToOrders,
} from "../../../helpers/CartBuildingHelpers";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import swal from "@sweetalert/with-react";

import styled from "styled-components";

const CommandLine = styled.span`
  display: flex;
`;

const OrderCommandLine = () => {
  const {
    chosen,
    setChosen,
    delivDate,
    setDelivDate,
    route,
    ponote,
  } = useContext(CurrentDataContext);
  const { orders, setOrders } = useContext(OrdersContext);
  const { customers } = useContext(CustomerContext);
  const { standing } = useContext(StandingContext);
  const { products } = useContext(ProductsContext);
  const { orderTypeWhole, setOrderTypeWhole, setRouteIsOn, setModifications } = useContext(
    ToggleContext
  );

  let tomorrow = todayPlus()[1];

  const checkForCustomer = (entry, customers) => {
    let nextCustomer = chosen;

    if (entry.includes("retail ")) {
      setOrderTypeWhole(false);
      let newRetailCustName = entry.replace("retail ", "");
      let newRetailCustList = [...orders];
      let newRetailCustEntry = {
        custName: newRetailCustName,
        isWhole: false,
        route: "atownpick",
        delivDate: convertDatetoBPBDate(delivDate),
      };
      newRetailCustList.push(newRetailCustEntry);

      setOrders(newRetailCustList);
      setDelivDate(tomorrow);
      setChosen(newRetailCustName);
      setModifications(true)
      return;
    }

    for (let cust of customers) {
      if (
        entry.includes(cust["custName"]) ||
        entry.includes(cust["nickName"])
      ) {
        nextCustomer = cust["custName"];
        if (nextCustomer !== "  ") {
          setChosen(nextCustomer);
          setRouteIsOn(true);
          setDelivDate(tomorrow);
          setOrderTypeWhole(true);
          setModifications(true)
          return;
        }
      }
    }

    if (nextCustomer === "" && chosen === "") {
      swal({
        text: "Please choose a customer",
        icon: "error",
        buttons: false,
        timer: 2000,
      });
      return;
    }

    return false;
  };

  const checkForDelivDate = (entry) => {
    let [today, tomorrow, twoDay] = todayPlus();
    let [Sun, Mon, Tues, Wed, Thurs, Fri, Sat] = daysOfTheWeek();
    let dateWords = [
      ["today", today],
      ["tomorrow", tomorrow],
      ["2day", twoDay],
      ["twoday", twoDay],
      ["twoDay", twoDay],
      ["sun", Sun],
      ["mon", Mon],
      ["tue", Tues],
      ["tues", Tues],
      ["wed", Wed],
      ["thu", Thurs],
      ["thur", Thurs],
      ["thurs", Thurs],
      ["fri", Fri],
      ["sat", Sat],
    ];
    for (let wordSet of dateWords) {
      if (entry.includes(wordSet[0])) {
        setDelivDate(wordSet[1]);
      }
    }
  };

  const checkForProducts = (entry) => {
    if (testEntryForProduct(entry)) {
      let enteredProducts = createArrayofEnteredProducts(entry);
      let ordersToUpdate = createOrdersToUpdate(
        products,
        enteredProducts,
        chosen,
        ponote,
        route,
        orderTypeWhole,
        delivDate
      );
      let custOrderList = buildCurrentOrder(
        chosen,
        delivDate,
        orders,
        standing
      );
      let ordersToModify = [...orders];
      if (custOrderList.length > 0) {
        ordersToModify = buildOrdersToModify(
          orders,
          chosen,
          delivDate,
          ordersToUpdate,
          custOrderList
        );
      }
      let addedOrdersToUpdate = addUpdatesToOrders(
        chosen,
        delivDate,
        ordersToUpdate,
        ordersToModify
      );
      setOrders(addedOrdersToUpdate);
      setModifications(true)
    }
  };

  const interpretEntry = async (entry) => {
    checkForCustomer(entry, customers);
    checkForDelivDate(entry);
    checkForProducts(entry);
  };

  const handleInput = (entry) => {
    if (entry.key === "Enter") {
      interpretEntry(entry.target.value);
      document.getElementById("orderCommand").value = "";
    }
    return;
  };

  const lookingForHelp = () => {
    const el = document.createElement("div");
    el.innerHTML =
      "<div style='text-align: left'><h3>How to use the Command Line</h3><p>This command line lets you use common bakery nicknames to enter orders.</p><p>To find a customer, enter a nickname.  Try 'high' or 'kberg'.  For a full list of customers and nicknames, <a href='/Customers' target='blank'>CLICK HERE</a></p><p>To enter a new product order, try '5 bag' or '10 bz' or '12 pl'.  You can even put them all in one line like '5 bag 10 bz 12 pl'. For a list of product nicknames, <a href='/Products' target='blank'>CLICK HERE</a></p><p>To jump to a future date, try 'tomorrow','2day','sun','mon','tues', etc.</p><p>To enter a retail order, type 'retail', then a space, then the customer's name.  For example, 'retail Milos'</p></div>";

    swal({
      showConfirmButton: true,
      confirmButtonText: '<a href="/Customers">Customers</a>',
      cancelBUttonText: '<a href="/Products">Products</a>',

      content: el,
    });
  };

  return (
    <React.Fragment>
      <CommandLine>
        <span className="p-float-label">
          <InputText id="orderCommand" size="50" onKeyUp={handleInput} />
          <label htmlFor="orderCommand">
            Enter Customers, Orders, Dates ...
          </label>
        </span>
        <Button
          icon="pi pi-question"
          className="p-button-outlined p-button-rounded p-button-help p-button-sm"
          onClick={(e) => lookingForHelp(e)}
        />
      </CommandLine>
    </React.Fragment>
  );
};

export default OrderCommandLine;
