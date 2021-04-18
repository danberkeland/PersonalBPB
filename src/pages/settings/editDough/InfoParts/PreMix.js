import React, { useState } from "react";

import "primeflex/primeflex.css";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

import {
  getCompList,
  getFlourWeight,
  getItemPercent,
  handleInput,
} from "./utils";

import styled from "styled-components";

const AddButtons = styled.div`
  display: flex;
  width: 60%;
  margin: auto;
  padding: 10px;
  justify-content: space-around;
`;

const clonedeep = require("lodash.clonedeep");

const preIngs = [
  { preIng: "Levain" },
  { preIng: "Poolish" },
  { preIng: "Rye Levain" },
  { preIng: "Hi Glut Levain" },
  { preIng: "Hi Glut Poolish" },
];

const PreMix = ({
  selectedDough,
  doughComponents,
  setDoughComponents,
  setIsModified,
}) => {
  const [selectedPre, setSelectedPre] = useState("");

  const pre = getCompList("lev", doughComponents, selectedDough);

  const handlePrePick = (e) => {
    console.log(e.value);
    setSelectedPre(e.value.preIng);
  };

  const handleAddPre = () => {
    let listToMod = clonedeep(doughComponents);
    let newItem = {
      dough: selectedDough.doughName,
      componentType: "lev",
      componentName: selectedPre,
      amount: 0,
    };

    listToMod.push(newItem);
    setDoughComponents(listToMod);
  };

  const directWeight = (e) => {
    let fl = getFlourWeight(e, doughComponents, selectedDough);
    let percent = getItemPercent(e, doughComponents, selectedDough);
    return (fl * percent * 0.01).toFixed(2);
  };

  return (
    <React.Fragment>
      <div className="datatable-templating-demo">
        <div className="card">
          {pre.length > 0 ? (
            <DataTable value={pre} className="p-datatable-sm">
              <Column field="ing" header="Pre Mix"></Column>

              <Column
                className="p-text-center"
                header="% of flour weight"
                body={(e) =>
                  handleInput(
                    e,
                    doughComponents,
                    selectedDough,
                    setDoughComponents,
                    setIsModified
                  )
                }
              ></Column>
              <Column
                className="p-text-center"
                header="Weight"
                body={directWeight}
              ></Column>
              <Column
                className="p-text-center"
                header="Total %"
                body={(e) => getItemPercent(e, doughComponents, selectedDough)}
              ></Column>
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      <AddButtons className="addPre">
        <Dropdown
          id="preIng"
          optionLabel="preIng"
          options={preIngs}
          style={{ width: "50%" }}
          onChange={handlePrePick}
          placeholder={selectedPre !== "" ? selectedPre : "Select a Pre Mix"}
        />
        <Button
          className="p-button-rounded p-button-outlined"
          icon="pi pi-plus"
          onClick={handleAddPre}
        />
      </AddButtons>
    </React.Fragment>
  );
};

export default PreMix;
