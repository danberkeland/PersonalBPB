import React, { useState, useEffect, useContext } from "react";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { promisedData } from "../../helpers/databaseFetchers";
import ComposeDough from "./BPBNSetOutUtils/composeDough";
import { todayPlus } from "../../helpers/dateTimeHelpers";

import { updateDough } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

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

  const handleChange = (e) => {
    if (e.code === "Enter") {
      updateDoughDB(e);
    }
  };

  const handleBlur = (e) => {
    updateDoughDB(e);
  };

  const updateDoughDB = async (e) => {
   
    let id = e.target.id.split("_")[0];
    let attr = e.target.id.split("_")[1];
    let qty = e.target.value;

    let updateDetails = {
      id: id,
      [attr]: qty,
    };
    

    try {
      await API.graphql(
        graphqlOperation(updateDough, { input: { ...updateDetails } })
      );
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
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
                    <InputText
                      key={dough.id + "_oldDough"}
                      id={dough.id + "_oldDough"}
                      placeholder={dough.oldDough}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </TwoColumnGrid>
                <TwoColumnGrid>
                  <span>Buffer Dough:</span>
                  <div className="p-inputgroup">
                    <InputText
                      key={dough.id + "_buffer"}
                      id={dough.id + "_buffer"}
                      placeholder={dough.buffer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </TwoColumnGrid>
              </div>
              <Button
                key={dough.id + "print"}
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
