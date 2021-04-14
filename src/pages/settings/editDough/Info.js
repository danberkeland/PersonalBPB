import React from "react";

import "primeflex/primeflex.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const drys = [
  {ing: "Bread Flour"},
  {ing: "WW Flour"},
  {ing: "Rye Flour"},

]

const wets = [
  {ing: "Water"},

]


const pre = [
  {ing: "Levain"},
]

const additions = [
  {ing: "Salt"},
  {ing: "Yeast"},
]

const filterDoughFor = (doughComponents, selectedDough, type) => {
  let filterDough = doughComponents.filter(
    (dgh) => dgh.dough === selectedDough.doughName && dgh.componentType === type
  );

  return filterDough;
};

const PreFerments = ({ doughComponents, selectedDough }) => {
  let filteredDough = filterDoughFor(doughComponents, selectedDough, "pre");
  let doughMap = filteredDough.map((dgh) => (
    <div>
      {dgh.componentName} {dgh.amount}
    </div>
  ));

  return (
    <React.Fragment>
      <h2>Preferments</h2>
      {doughComponents ? doughMap : ""}
      <Button>Add a Preferment</Button>
    </React.Fragment>
  );
};

const BulkMix = ({ doughComponents, selectedDough }) => {
  let filteredDry = filterDoughFor(doughComponents, selectedDough, "dry").map(
    (dgh) => (
      <div>
        {dgh.componentName} {dgh.amount}
      </div>
    )
  );
  let filteredDryPlus = filterDoughFor(
    doughComponents,
    selectedDough,
    "dryplus"
  ).map((dgh) => (
    <div>
      {dgh.componentName} {dgh.amount}
    </div>
  ));
  let filteredWet = filterDoughFor(doughComponents, selectedDough, "wet").map(
    (dgh) => (
      <div>
        {dgh.componentName} {dgh.amount}
      </div>
    )
  );
  let filteredWetPlus = filterDoughFor(
    doughComponents,
    selectedDough,
    "wetplus"
  ).map((dgh) => (
    <div>
      {dgh.componentName} {dgh.amount}
    </div>
  ));

  return (
    <React.Fragment>
      <h2>Bulk Mix</h2>
      {doughComponents ? (
        <div>
          {filteredDry}
          {filteredDryPlus}
          {filteredWet}
          {filteredWetPlus}
        </div>
      ) : (
        ""
      )}
      <Button>Add to mix</Button>
    </React.Fragment>
  );
};

const PostMix = ({ doughComponents, selectedDough }) => {
  let filteredDough = filterDoughFor(doughComponents, selectedDough, "post");
  let doughMap = filteredDough.map((dgh) => (
    <div>
      {dgh.componentName} {dgh.amount}
    </div>
  ));

  

  return (
    <React.Fragment>
      <h2>Post Mix Additions</h2>
      {doughComponents ? doughMap : ""}
      <Button>Add post mix addition</Button>
    </React.Fragment>
  );
};

const Info = ({
  selectedDough,
  setSelectedDough,
  doughs,
  setDoughs,
  doughComponents,
  setDoughComponents,
}) => {

  const header = (
    <div className="table-header">
        Bulk Mix
    </div>
);
  const footer = `In total there are products.`;

  const deleteButton = () => {
    return (
      <Button icon="pi pi-times-circle" />
    )
  }


  return (
    <React.Fragment>
      <div className="p-grid p-ai-center">
        <div className="p-col">
          <div>Dough Name: Baguette</div>
        </div>
        <div className="p-col">
          <label htmlFor="firstname3">Hydration</label>
          
            <InputText id="firstname3" type="text" style={{ width: "50px" }} />%
          
        </div>
        <div className="p-col">
          <label htmlFor="firstname3">Default Bulk:</label>
          
            <InputText id="firstname3" type="text" style={{ width: "50px" }} />
            lb.
         
        </div>
      </div>
      <div className="datatable-templating-demo">
            <div className="card">
                <DataTable value={pre} >
               
                    <Column field="ing" header="Pre Mix"></Column>
                    <Column className="p-text-center" header="% of flour weight"></Column>
                    <Column className="p-text-right" body={deleteButton}></Column>
                    
                </DataTable>
            </div>
        </div>
      <div className="datatable-templating-demo">
            <div className="card">
                <DataTable value={drys} >
                
                    <Column field="ing" header="Dry"></Column>
                    <Column className="p-text-center" header="Proportion"></Column>
                    <Column className="p-text-center" header="Weight"></Column>
                    <Column className="p-text-center" header="100%"></Column>
                    <Column className="p-text-right" body={deleteButton}></Column>
                    
                </DataTable>
            </div>
        </div>
        <div className="datatable-templating-demo">
            <div className="card">
                <DataTable value={wets} >
                    
                    <Column field="ing" header="Wets"></Column>
                    <Column className="p-text-center" header="Proportion"></Column>
                    <Column className="p-text-center" header="Weight"></Column>
                    <Column className="p-text-center" header="60%"></Column>
                    <Column className="p-text-right" body={deleteButton}></Column>
                    
                </DataTable>
            </div>
        </div>
        <div className="datatable-templating-demo">
            <div className="card">
                <DataTable value={additions} >
                    
                    <Column field="ing" header="Additions"></Column>
                    <Column className="p-text-center" header="% flour weights"></Column>
                    <Column className="p-text-center" header="Weight"></Column>
                    <Column className="p-text-right" body={deleteButton}></Column>
                    
                    
                </DataTable>
            </div>
        </div>
      
    </React.Fragment>
  );
};

export default Info;
