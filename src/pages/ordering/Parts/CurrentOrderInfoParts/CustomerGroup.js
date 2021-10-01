import React, { useContext, useEffect, useState } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";

import { Dropdown } from "primereact/dropdown";

import { tomorrow } from "../../../../helpers/dateTimeHelpers";
import { createRetailOrderCustomers } from "../../../../helpers/sortDataHelpers";

const clonedeep = require("lodash.clonedeep");

const CustomerGroup = ({ database, customerGroup, setCustomerGroup }) => {
  const { orderTypeWhole, setModifications } = useContext(ToggleContext);
  const [userNum, setUserNum] = useState()
  const [products, customers, routes, standing, orders] = database;
  const {
    chosen,

    setChosen,
    setDelivDate,
  } = useContext(CurrentDataContext);

  useEffect(() => {
    let currentUser = Auth.currentAuthenticatedUser().then((use) =>
      setUserNum(use.attributes.sub)
    );
  }, []);

  useEffect(() => {
    let newCustList = clonedeep(customers)
    if (database.length > 0) {
      for (let cust of newCustList){
        if (cust.userSubs === null){
          cust.userSubs = []
        }
      }
      console.log("userNum",userNum)
      console.log("customerSelect",newCustList)
      let customerSelect = newCustList.filter(cust => cust.userSubs.includes(userNum) || userNum==="64205737-fcdc-44a2-bd87-e951873d2366")
      orderTypeWhole
        ? setCustomerGroup(customerSelect)
        : setCustomerGroup(createRetailOrderCustomers(orders));
    }
  }, [customers, orderTypeWhole, orders, database, userNum]);

  const handleChosen = (chosen) => {
    setChosen(chosen);
    setDelivDate(tomorrow());
   
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
