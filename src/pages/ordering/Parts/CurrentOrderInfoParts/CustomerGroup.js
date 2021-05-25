import React, { useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import { Dropdown } from "primereact/dropdown";

import { tomorrow } from "../../../../helpers/dateTimeHelpers";
import { createRetailOrderCustomers } from "../../../../helpers/sortDataHelpers";

const CustomerGroup = ({ database, customerGroup, setCustomerGroup }) => {
  const { orderTypeWhole, setModifications } = useContext(ToggleContext);

  const [products, customers, routes, standing, orders] = database;
  const {
    chosen,

    setChosen,
    setDelivDate,
  } = useContext(CurrentDataContext);


  useEffect(() => {
    if (database.length > 0) {
      orderTypeWhole
        ? setCustomerGroup(customers)
        : setCustomerGroup(createRetailOrderCustomers(orders));
    }
  }, [customers, orderTypeWhole, orders, database]);

  const handleChosen = (chosen) => {
    setChosen(chosen);
    setDelivDate(tomorrow());
    setModifications(false);
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
