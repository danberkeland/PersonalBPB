import React, { useContext } from "react";

import { Button } from "primereact/button";
import { confirmDialog } from 'primereact/confirmdialog'

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../../dataContexts/ToggleContext";
import { convertDatetoBPBDate } from "../../../../../helpers/dateTimeHelpers";

import { v4 as uuidv4 } from "uuid";

const clonedeep = require("lodash.clonedeep");

const TrashCan = ({ order, database, setDatabase }) => {
  const [products, customers, routes, standing, orders] = database;
  const { chosen, delivDate,currentCartList,
    setCurrentCartList, } = useContext(CurrentDataContext);
  const { setModifications } = useContext(ToggleContext);

  const handleTrash = (prodName) => {
    let ordToMod = clonedeep(currentCartList);
    let ind = ordToMod.findIndex(
      (ord) =>
        ord.prodName === prodName &&
        ord.custName === chosen &&
        ord.delivDate === convertDatetoBPBDate(delivDate)
    );
    ordToMod[ind].qty = 0;
    
    setCurrentCartList(ordToMod);
    setModifications(true);
  };

  const confirm = (e) => {
    confirmDialog({
        message: 'Are you sure you want to delete this item?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => handleTrash(e),
       
    });
}

  return (
    <Button
      icon="pi pi-trash"
      className="p-button-outlined p-button-rounded p-button-help p-button-sm"
      value={0}
      onClick={(e) => {
        confirm(order["prodName"]);
      }}
      key={uuidv4() + "e"}
      name={order["prodName"]}
      data-qty={order["qty"]}
      id={order["prodName"]}
    />
  );
};

export default TrashCan;
