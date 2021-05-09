import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";

import { promisedMakeData } from "./BPBSWhatToMakeUtils/getMakeData";
import ComposeWhatToMake from "./BPBSWhatToMakeUtils/composeWhatToMake";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const compose = new ComposeWhatToMake();

function BPBSWhatToMake() {

  const { setIsLoading } = useContext(ToggleContext);
  const [freshProds, setFreshProds] = useState();
  const [shelfProds, setShelfProds] = useState();
  const [freezerProds, setFreezerProds] = useState();
  const [pocketsNorth, setPocketsNorth] = useState();

  let delivDate = todayPlus()[0];

  useEffect(() => {
    promisedMakeData(setIsLoading).then(database => gatherMakeInfo(database));
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherMakeInfo = (database) => {
    let makeData = compose.returnMakeBreakDown(database)
    setPocketsNorth(makeData.pocketsNorth);
    setFreshProds(makeData.freshProds);
    setShelfProds(makeData.shelfProds);
    setFreezerProds(makeData.freezerProds);
  }

  return (
    <React.Fragment>
      <WholeBox>
        <h1>BPBS What To Make {convertDatetoBPBDate(delivDate)}</h1>

        <h2>Send Pockets North</h2>
        <DataTable value={pocketsNorth} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
        </DataTable>

        <h2>Make Fresh</h2>
        <DataTable value={freshProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
          <Column field="bagEOD" header="Bag for Tomorrow"></Column>
        </DataTable>
        <h2>Make For Shelf</h2>
        <DataTable value={shelfProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="needEarly" header="Need Early"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
        </DataTable>
        <h2>Make For Freezer</h2>
        <DataTable value={freezerProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="needEarly" header="Need Early"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBSWhatToMake;
