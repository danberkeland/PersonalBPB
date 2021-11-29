


import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeFreezerThaw from "./utils/composeFreezerThaw";

import styled from "styled-components";
import { calcInvoiceTotal } from "../billing/helpers";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const compose = new ComposeFreezerThaw();

function RetailBags() {
  const { setIsLoading } = useContext(ToggleContext);
  const [retailBags, setRetailBags] = useState();
  const [freezerThaw,setFreezerThaw] = useState();

  let delivDate = todayPlus()[0];
  

  useEffect(() => {
    promisedData(setIsLoading).then(database => gatherFreezerThaw(database));
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherFreezerThaw = (database) => {
    let freezerThawData = compose.returnFreezerThaw(database)
   
    setFreezerThaw(freezerThawData.freezerThaw);
  }

  const calcTotal = (e) => {
      return (<div>{e.qty * e.packSize}</div>)
  }
 
  return (
    <React.Fragment>
      <WholeBox>
        <h1>Freezer Thaw</h1>

        <h2>{convertDatetoBPBDate(delivDate)}</h2>
        <DataTable value={freezerThaw}   className="p-datatable-sm"
            >
        <Column field="custName" header="Customer"></Column>
          <Column field="prodName" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
          <Column field="packSize" header="Pack Size"></Column>
          <Column header="Total" body ={e => calcTotal(e)}></Column>
          
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default RetailBags;
