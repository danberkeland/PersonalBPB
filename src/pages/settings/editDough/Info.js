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
    
    let placeholder = doughComponents
      .filter((dgh) => dgh.dough === selectedDough.doughName && dgh.componentName === e.ing)[0].amount
    return (
      <InputText
        id="firstname3"
        type="text"
        style={{ width: "50px" }}
        placeholder={placeholder}
        
      />
    );
  };

  

  const getFlourWeight = (e) => {
    let bulkWeight = selectedDough.batchSize;
    let hydro = Number(selectedDough.hydration);
    let levNum = 0;
    doughComponents
      .filter(
        (dgh) =>
          dgh.dough === selectedDough.doughName && dgh.componentType === "pre"
      )
      .forEach((element) => {
        levNum = levNum + element.amount;
      });
    let addNum = 0;
    doughComponents
      .filter(
        (dgh) =>
          dgh.dough === selectedDough.doughName &&
          dgh.componentType === "dryplus"
      )
      .forEach((element) => {
        addNum = addNum + element.amount;
      });
    
    
    let fl = (
      bulkWeight /
      (1 + hydro * 0.01 + levNum * 0.01 + addNum * 0.01)
    ).toFixed(2);

    return fl;
  };


  const dryWeight =(e) => {
    let fl = getFlourWeight(e)
    let thisAmount = doughComponents.filter(
      (dgh) =>
        dgh.dough === selectedDough.doughName && dgh.componentName === e.ing
    )[0].amount;
    return (fl*.01*thisAmount).toFixed(2)
  }

  const wetWeight =(e) => {
    let fl = getFlourWeight(e)
    let hydro = Number(selectedDough.hydration);
    let thisAmount = doughComponents.filter(
      (dgh) =>
        dgh.dough === selectedDough.doughName && dgh.componentName === e.ing
    )[0].amount;
    return (fl*.01*thisAmount*hydro*.01).toFixed(2)
  }
  
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
              body={handleInput}
            ></Column>
            <Column className="p-text-center" header="Weight" body={dryWeight}></Column>
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
            <Column className="p-text-center" header="Weight" body={dryWeight}></Column>
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
            <Column className="p-text-center" header="Weight" body={wetWeight}></Column>
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
            <Column className="p-text-center" header="Weight" body={dryWeight}></Column>
            <Column className="p-text-center" header="Total %"></Column>
            <Column className="p-text-right" body={deleteButton}></Column>
            
          </DataTable>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Info;
