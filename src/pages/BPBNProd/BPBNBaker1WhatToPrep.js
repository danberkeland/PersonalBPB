import React, { useEffect, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeWhatToPrep from "./Utils/composeWhatToPrep";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const compose = new ComposeWhatToPrep();

function BPBNBaker1WhatToPrep({ whatToPrep, setWhatToPrep }) {
  const { setIsLoading } = useContext(ToggleContext);

  let delivDate = todayPlus()[0];

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherWhatToPrepInfo(database)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToPrepInfo = (database) => {
    let whatToPrepData = compose.returnWhatToPrepBreakDown(delivDate, database);
    setWhatToPrep(whatToPrepData.whatToPrep);
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>What To Prep {convertDatetoBPBDate(delivDate)}</h1>

        <DataTable value={whatToPrep} className="p-datatable-sm">
          <Column field="prodName" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNBaker1WhatToPrep;
