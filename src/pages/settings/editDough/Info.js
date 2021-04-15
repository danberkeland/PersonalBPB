import React from "react";

import "primeflex/primeflex.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { setValue, fixValue } from "../../../helpers/formHelpers";

const clonedeep = require("lodash.clonedeep");

const Info = ({
  selectedDough,
  setSelectedDough,
  doughComponents,
  setDoughComponents,
}) => {
  console.log(selectedDough);

  const getCompList = (comp) => {
    let compList = doughComponents
      .filter(
        (dgh) =>
          dgh.dough === selectedDough.doughName && dgh.componentType === comp
      )
      .map((dg) => ({ ing: dg.componentName }));
    return compList;
  };

  const drys = getCompList("dry");
  const wets = getCompList("wet");
  const pre = getCompList("pre");
  const additions = getCompList("dryplus");

  const deleteButton = () => {
    return (
      <Button
        icon="pi pi-times"
        className="p-button-outlined p-button-rounded p-button-help p-button-sm"
      />
    );
  };

  const handleInput = (e) => {
    let placeholder = getAmount(e);
    let id;
    doughComponents
      .filter(
        (dgh) =>
          dgh.dough === selectedDough.doughName && dgh.componentName === e.ing
      )
      .forEach((element) => {
        id =
          selectedDough.doughName +
          "_" +
          element.componentName +
          "_" +
          element.componentType;
      });
    return (
      <InputText
        id={id}
        style={{ width: "50px" }}
        placeholder={placeholder}
        onKeyUp={(e) =>
          e.code === "Enter" && setDoughComponents(handleChange(e, id))
        }
        onBlur={(e) => setDoughComponents(handleBlur(e, id))}
      />
    );
  };

  const updateItem = (value, itemToUpdate, itemInfo) => {
    itemToUpdate[
      itemToUpdate.findIndex(
        (item) =>
          item.dough === itemInfo[0] &&
          item.componentName === itemInfo[1] &&
          item.componentType === itemInfo[2]
      )
    ].amount = value.target.value;
  };

  const handleChange = (value, id) => {
    if (value.code === "Enter") {
      let itemToUpdate = clonedeep(doughComponents);
      let itemInfo = id.split("_");
      updateItem(value, itemToUpdate, itemInfo);
      document.getElementById(id).value = "";
      return itemToUpdate;
    }
  };

  const handleBlur = (value, id) => {
    let itemToUpdate = clonedeep(doughComponents);
    let itemInfo = id.split("_");
    if (value.target.value !== "") {
      updateItem(value, itemToUpdate, itemInfo);
    }
    document.getElementById(id).value = "";
    return itemToUpdate;
  };

  const getAmount = (e) => {
    let thisAmount = doughComponents.filter(
      (dgh) =>
        dgh.dough === selectedDough.doughName && dgh.componentName === e.ing
    )[0].amount;
    return thisAmount;
  };

  const addUp = (comp) => {
    let compSum = 0;
    doughComponents
      .filter(
        (dgh) =>
          dgh.dough === selectedDough.doughName && dgh.componentType === comp
      )
      .forEach((element) => {
        compSum = compSum + element.amount;
      });
    return compSum;
  };

  const getPercent = (e, comp) => {
    let thisAmount = getAmount(e);
    let totalAmount = addUp(comp);
    return thisAmount / totalAmount;
  };

  const getItemPercent = (e) => {
    let placeholder = getAmount(e);
    return placeholder;
  };

  const getWetPercent = (e) => {
    let hydro = Number(selectedDough.hydration);
    let percent = getPercent(e, "wet");
    return percent * hydro * 0.01;
  };

  const getDryPercent = (e) => {
    let percent = getPercent(e, "dry");
    return percent * 100;
  };

  const getFlourWeight = (e) => {
    let bulkWeight = selectedDough.batchSize;
    let hydro = Number(selectedDough.hydration);
    let levNum = addUp("pre");
    let addNum = addUp("dryplus");
    let fl = (
      bulkWeight /
      (1 + hydro * 0.01 + levNum * 0.01 + addNum * 0.01)
    ).toFixed(2);
    return fl;
  };

  const dryWeight = (e) => {
    let fl = getFlourWeight(e);
    let percent = getPercent(e, "dry");
    return (fl * percent).toFixed(2);
  };

  const wetWeight = (e) => {
    let fl = getFlourWeight(e);
    let hydro = Number(selectedDough.hydration);
    let percent = getPercent(e, "wet");
    return (fl * percent * hydro * 0.01).toFixed(2);
  };

  return (
    <React.Fragment>
      <div className="p-grid p-ai-center">
        <div className="p-col">
          <div>Dough Name: {selectedDough.doughName}</div>
        </div>
        <div className="p-col">
          <label htmlFor="hydration">Hydration</label>
          <InputText
            id="hydration"
            style={{ width: "50px" }}
            placeholder={selectedDough.hydration}
            onKeyUp={(e) =>
              e.code === "Enter" && setSelectedDough(setValue(e, selectedDough))
            }
            onBlur={(e) => setSelectedDough(fixValue(e, selectedDough))}
          />
          %
        </div>
        <div className="p-col">
          <label htmlFor="batchSize">Default Bulk:</label>
          <InputText
            id="batchSize"
            style={{ width: "50px" }}
            placeholder={selectedDough.batchSize}
            onKeyUp={(e) =>
              e.code === "Enter" && setSelectedDough(setValue(e, selectedDough))
            }
            onBlur={(e) => setSelectedDough(fixValue(e, selectedDough))}
          />
          lb.
        </div>
      </div>
      <div className="datatable-templating-demo">
        <div className="card">
          <DataTable value={pre} className="p-datatable-sm">
            <Column field="ing" header="Pre Mix"></Column>

            <Column
              className="p-text-center"
              header="% of flour weight"
              body={handleInput}
            ></Column>
            <Column
              className="p-text-center"
              header="Weight"
              body={dryWeight}
            ></Column>
            <Column
              className="p-text-center"
              header="Total %"
              body={getItemPercent}
            ></Column>
            <Column className="p-text-right" body={deleteButton}></Column>
          </DataTable>
        </div>
      </div>
      <div className="datatable-templating-demo">
        <div className="card">
          <DataTable value={drys} className="p-datatable-sm">
            <Column field="ing" header="Dry"></Column>
            <Column
              className="p-text-center"
              header="Parts Dry"
              body={handleInput}
            ></Column>
            <Column
              className="p-text-center"
              header="Weight"
              body={dryWeight}
            ></Column>
            <Column
              className="p-text-center"
              header="100%"
              body={getDryPercent}
            ></Column>
            <Column className="p-text-right" body={deleteButton}></Column>
          </DataTable>
        </div>
      </div>
      <div className="datatable-templating-demo">
        <div className="card">
          <DataTable value={wets} className="p-datatable-sm">
            <Column field="ing" header="Wets"></Column>
            <Column
              className="p-text-center"
              header="Parts Wet"
              body={handleInput}
            ></Column>
            <Column
              className="p-text-center"
              header="Weight"
              body={wetWeight}
            ></Column>
            <Column
              className="p-text-center"
              header={Number(selectedDough.hydration) + "%"}
              body={getWetPercent}
            ></Column>
            <Column className="p-text-right" body={deleteButton}></Column>
          </DataTable>
        </div>
      </div>
      <div className="datatable-templating-demo">
        <div className="card">
          <DataTable value={additions} className="p-datatable-sm">
            <Column field="ing" header="Additions"></Column>
            <Column
              className="p-text-center"
              header="% flour weights"
              body={handleInput}
            ></Column>
            <Column
              className="p-text-center"
              header="Weight"
              body={dryWeight}
            ></Column>
            <Column
              className="p-text-center"
              header="Total %"
              body={getItemPercent}
            ></Column>
            <Column className="p-text-right" body={deleteButton}></Column>
          </DataTable>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Info;
