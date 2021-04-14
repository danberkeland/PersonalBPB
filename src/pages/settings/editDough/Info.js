import React from "react";

import "primeflex/primeflex.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";



const Info = ({
  selectedDough,
  setSelectedDough,
  doughs,
  setDoughs,
  doughComponents,
  setDoughComponents,
}) => {
  console.log(selectedDough);
  const drys = doughComponents
    .filter((dgh) => dgh.dough === selectedDough.doughName && dgh.componentType === "dry")
    .map((dg) => ({ ing: dg.componentName }));
  
  const wets = doughComponents
  .filter((dgh) => dgh.dough === selectedDough.doughName && dgh.componentType === "wet")
  .map((dg) => ({ ing: dg.componentName }));
  
  const pre = doughComponents
  .filter((dgh) => dgh.dough === selectedDough.doughName && dgh.componentType === "pre")
  .map((dg) => ({ ing: dg.componentName }));
  
  const additions = doughComponents
  .filter((dgh) => dgh.dough === selectedDough.doughName && dgh.componentType === "dryplus")
  .map((dg) => ({ ing: dg.componentName }));

  const deleteButton = () => {
    return <Button icon="pi pi-times"
    className="p-button-outlined p-button-rounded p-button-help p-button-sm" />;
  };

  const handleInput = (e) => {
    console.log(e)
    let placeholder = doughComponents
      .filter((dgh) => dgh.dough === selectedDough.doughName && dgh.componentName === e.ing)[0].amount
    console.log(placeholder)
    return (
      <InputText
        id="firstname3"
        type="text"
        style={{ width: "50px" }}
        placeholder={placeholder}
        
      />
    );
  };

  return (
    <React.Fragment>
      <div className="p-grid p-ai-center">
        <div className="p-col">
          <div>Dough Name: {selectedDough.doughName}</div>
        </div>
        <div className="p-col">
          <label htmlFor="firstname3">Hydration</label>
          <InputText
            id="firstname3"
            type="text"
            style={{ width: "50px" }}
            placeholder={Number(selectedDough.hydration)}
          />
          %
        </div>
        <div className="p-col">
          <label htmlFor="firstname3">Default Bulk:</label>
          <InputText
            id="firstname3"
            type="text"
            style={{ width: "50px" }}
            placeholder={Number(selectedDough.batchSize)}
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
              id="dryplus"
              body={handleInput}
            ></Column>
            <Column className="p-text-center" header="Weight"></Column>
            <Column className="p-text-center" header="Total %"></Column>
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
            <Column className="p-text-center" header="Weight"></Column>
            <Column className="p-text-center" header="100%"></Column>
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
            <Column className="p-text-center" header="Weight"></Column>
            <Column
              className="p-text-center"
              header={Number(selectedDough.hydration) + "%"}
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
            <Column className="p-text-center" header="Weight"></Column>
            <Column className="p-text-center" header="Total %"></Column>
            <Column className="p-text-right" body={deleteButton}></Column>
            
          </DataTable>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Info;
