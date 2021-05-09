import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


import { ToggleContext } from "../../dataContexts/ToggleContext";

import { promisedSetOut } from "./BPBNSetOutUtils/getSetOutData";
import ComposeSetOut from "./BPBNSetOutUtils/composeSetOut";
import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const compose = new ComposeSetOut();

function BPBNSetOut({ loc }) {

  let delivDate = todayPlus()[0];
  
  const { setIsLoading } = useContext(ToggleContext);
  const [ setOut, setSetOut ] = useState([])

  useEffect(() => {
    promisedSetOut(setIsLoading).then(database => gatherSetOutInfo(database));
}, []); // eslint-disable-line react-hooks/exhaustive-deps
  

const gatherSetOutInfo = (database) => {
  let setOutData = compose.returnSetOutBreakDown(database,loc)
  setSetOut(setOutData.setOut);
}
  
  return (
    <React.Fragment>
      <WholeBox>
        <h1>
          {loc} Set Out {convertDatetoBPBDate(delivDate)}
        </h1>

        <h2>Set Out</h2>
        <DataTable value={setOut} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNSetOut;
