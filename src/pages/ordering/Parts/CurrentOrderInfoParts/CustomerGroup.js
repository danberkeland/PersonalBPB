import React, { useContext, useEffect, useState } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";

import { Dropdown } from "primereact/dropdown";
import { confirmDialog } from "primereact/confirmdialog";

import { tomorrow, todayPlus } from "../../../../helpers/dateTimeHelpers";
import { createRetailOrderCustomers } from "../../../../helpers/sortDataHelpers";

const clonedeep = require("lodash.clonedeep");

const { DateTime } = require("luxon");

const CustomerGroup = () => {
  const { orderTypeWhole, setModifications } = useContext(ToggleContext);
  const [userNum, setUserNum] = useState();
 
  const {
    chosen,

    setChosen,
    setDelivDate,
    database,
    authType,
    customerGroup,
    setCustomerGroup
  } = useContext(CurrentDataContext);

  const [products, customers, routes, standing, orders] = database;

  useEffect(() => {
    let currentUser = Auth.currentAuthenticatedUser().then((use) =>
      setUserNum(use.attributes.sub)

    
    );
  
  }, []);

  useEffect(() => {
    let newCustList = clonedeep(customers);
    if (database.length > 0) {
      for (let cust of newCustList) {
        if (cust.userSubs === null) {
          cust.userSubs = [];
        }
      }
      
      let customerSelect = newCustList.filter(
        (cust) =>
          cust.userSubs.includes(userNum) ||
          userNum === "263fd8de-c722-4b08-a9d7-e3b7197b13b7"
      );
      orderTypeWhole
        ? setCustomerGroup(customerSelect)
        : setCustomerGroup(createRetailOrderCustomers(orders));
    }
  }, [customers, orderTypeWhole, orders, database, userNum]);

  const handleChosen = (chosen) => {
    // let time = time right now
    let today = DateTime.now().setZone("America/Los_Angeles");
    let hour = today.c.hour;
    let minutes = today.c.minute/60;
    let totalHour = hour+minutes
    setChosen(chosen);
    if (Number(totalHour) > 18.5 && authType !== "bpbadmin" && authType) {
      confirmDialog({
        message:
          "6:00 PM order deadline for tomorrow has passed.  Next available order date is " +
          todayPlus()[2] +
          ". Continue?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => setDelivDate(todayPlus()[2]),
      });
      setModifications(false)
      setDelivDate(todayPlus()[2]);
    } else {
      setModifications(false)
      setDelivDate(tomorrow());
    }
  };

  return (
    <React.Fragment>
      <Dropdown
        id="customers"
        value={chosen}
        options={customerGroup}
        optionLabel="custName"
        placeholder={chosen === "  " ? "Select a Customer ..." : chosen}
        onChange={(e) => handleChosen(e.value.custName)}
      />
    </React.Fragment>
  );
};

export default CustomerGroup;
