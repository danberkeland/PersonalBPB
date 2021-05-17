import React, { useState, useEffect, useContext } from "react";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { promisedData } from "../../helpers/databaseFetchers";
import ComposeDough from "./BPBNSetOutUtils/composeDough";
import { todayPlus } from "../../helpers/dateTimeHelpers";



import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;
  padding: 5px;
`;

const compose = new ComposeDough();

function BPBNBuckets() {
  const { setIsLoading } = useContext(ToggleContext);

  const [doughs, setDoughs] = useState([]);
  const [doughComponents, setDoughComponents] = useState([]);

  let twoDay = todayPlus()[2];

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherDoughInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherDoughInfo = (database) => {
    let doughData = compose.returnDoughBreakDown(twoDay, database, "Carlton");
    setDoughs(doughData.doughs);
    setDoughComponents(doughData.doughComponents);
  };
  

  return (
    <React.Fragment>
      <WholeBox>
        <h1>BPBN Dough Stickers</h1>
        {doughs.map((dough) => (
          <React.Fragment>
            <h3>
              
              {dough.doughName}: (need {dough.needed} lb.) TOTAL:
              {Number(Number(dough.needed) + Number(dough.buffer))}
            </h3>
            <TwoColumnGrid>
              <div>
                <TwoColumnGrid>
                  <span>Old Dough:</span>
                  <div className="p-inputgroup">
                    <InputText placeholder={dough.oldDough} />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </TwoColumnGrid>
                <TwoColumnGrid>
                  <span>Buffer Dough:</span>
                  <div className="p-inputgroup">
                    <InputText placeholder={dough.buffer} />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </TwoColumnGrid>
              </div>
              <Button
                label="Print Sticker Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              />
            </TwoColumnGrid>
          </React.Fragment>
        ))}
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNBuckets;
