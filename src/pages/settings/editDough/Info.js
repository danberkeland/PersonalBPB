import React, { useState } from "react";

import "primeflex/primeflex.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

import { setValue, fixValue } from "../../../helpers/formHelpers";

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
];
const dryIngs = [
  { dryIng: "Bread Flour" },
  { dryIng: "Whole Wheat Flour" },
  { dryIng: "Rye Flour" },
];
const wetIngs = [
  { wetIng: "Water" },
  { wetIng: "Vegetable Oil" },
  { wetIng: "Egg" },
];
const addIngs = [{ addIng: "Salt" }, { addIng: "Yeast" }, { addIng: "Sugar" }];
const postIngs = [{ postIng: "Multigrains" }, { postIng: "Butter" }];

const Info = ({
  selectedDough,
  setSelectedDough,
  doughComponents,
  setDoughComponents,
}) => {
 

  const [selectedPre, setSelectedPre] = useState("");
  const [selectedDry, setSelectedDry] = useState("");
  const [selectedWet, setSelectedWet] = useState("");
  const [selectedAdd, setSelectedAdd] = useState("");
  const [selectedPost, setSelectedPost] = useState("");

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
  const posts = getCompList("post");

  
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
        style={{
          width: "50px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
        }}
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

  const handlePrePick = (e) => {
    console.log(e.value);
    setSelectedPre(e.value.preIng);
  };

  const handleDryPick = (e) => {
    setSelectedDry(e.value.dryIng);
  };

  const handleWetPick = (e) => {
    setSelectedWet(e.value.wetIng);
  };

  const handleAddPick = (e) => {
    setSelectedAdd(e.value.addIng);
  };

  const handlePostPick = (e) => {
    setSelectedPost(e.value.postIng);
  };


  const handleAddPost =() => {
    let listToMod = clonedeep(doughComponents)
    let newItem = ({
      dough: selectedDough.doughName,
      componentType: "post",
      componentName: selectedPost,
      amount: 0,
    })
   
    listToMod.push(newItem)
    setDoughComponents(listToMod)
  }

  const handleAddDry =() => {
    let listToMod = clonedeep(doughComponents)
    let newItem = ({
      dough: selectedDough.doughName,
      componentType: "dry",
      componentName: selectedDry,
      amount: 0,
    })
   
    listToMod.push(newItem)
    setDoughComponents(listToMod)
  }

  const handleAddWet =() => {
    let listToMod = clonedeep(doughComponents)
    let newItem = ({
      dough: selectedDough.doughName,
      componentType: "wet",
      componentName: selectedWet,
      amount: 0,
    })
   
    listToMod.push(newItem)
    setDoughComponents(listToMod)
  }

  const handleAddAdd =() => {
    let listToMod = clonedeep(doughComponents)
    let newItem = ({
      dough: selectedDough.doughName,
      componentType: "dryplus",
      componentName: selectedAdd,
      amount: 0,
    })
   
    listToMod.push(newItem)
    setDoughComponents(listToMod)
  }

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
        compSum = compSum + Number(element.amount);
      });
    return compSum;
  };

  const getPercent = (e, comp) => {
    let thisAmount = getAmount(e);
    console.log(thisAmount)
    let totalAmount = addUp(comp);
    console.log(totalAmount)
    return thisAmount / totalAmount;
  };

  const getItemPercent = (e) => {
    let placeholder = getAmount(e);
    return placeholder;
  };

  const getWetPercent = (e) => {
    let hydro = Number(selectedDough.hydration);
    let percent = getPercent(e, "wet");
    return percent * hydro;
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
    let postNum = addUp("post")
    let fl = (
      bulkWeight /
      (1 + hydro * 0.01 + levNum * 0.01 + addNum * 0.01 + postNum * 0.01)
    ).toFixed(2);
    return fl;
  };

  const dryWeight = (e) => {
    let fl = getFlourWeight(e);
    let percent = getPercent(e,"dry");
    return (fl * percent).toFixed(2);
  };

  const directWeight = (e) => {
    let fl = getFlourWeight(e);
    let percent = getItemPercent(e);
    return (fl * percent * .01).toFixed(2);
  };

  const wetWeight = (e) => {
    let fl = getFlourWeight(e);
    let hydro = Number(selectedDough.hydration);
    let percent = getPercent(e, "wet");
    return (fl * percent * hydro * .01).toFixed(2);
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
            style={{
              width: "50px",
              backgroundColor: "#E3F2FD",
              fontWeight: "bold",
            }}
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
            style={{
              width: "50px",
              backgroundColor: "#E3F2FD",
              fontWeight: "bold",
            }}
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
          {pre.length > 0 ? (
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
                body={directWeight}
              ></Column>
              <Column
                className="p-text-center"
                header="Total %"
                body={getItemPercent}
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
        />
      </AddButtons>
      <div className="datatable-templating-demo">
        <div className="card">
          {drys.length > 0 ? (
            <DataTable value={drys} className="p-datatable-sm">
              <Column field="ing" header="Drys"></Column>
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
             
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      <AddButtons className="addDry">
        <Dropdown
          id="dryIng"
          optionLabel="dryIng"
          options={dryIngs}
          style={{ width: "50%" }}
          onChange={handleDryPick}
          placeholder={selectedDry !== "" ? selectedDry : "Select a Dry Mix"}
        />
        <Button
          className="p-button-rounded p-button-outlined"
          icon="pi pi-plus"
          onClick={handleAddDry}
        />
      </AddButtons>
      <div className="datatable-templating-demo">
        <div className="card">
          {wets.length > 0 ? (
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
            
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      <AddButtons className="addWet">
        <Dropdown
          id="wetIng"
          optionLabel="wetIng"
          options={wetIngs}
          style={{ width: "50%" }}
          onChange={handleWetPick}
          placeholder={selectedWet !== "" ? selectedWet : "Select a Wet Mix"}
        />
        <Button
          className="p-button-rounded p-button-outlined"
          icon="pi pi-plus"
          onClick={handleAddWet}
        />
      </AddButtons>
      <div className="datatable-templating-demo">
        <div className="card">
          {additions.length > 0 ? (
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
                body={directWeight}
              ></Column>
              <Column
                className="p-text-center"
                header="Total %"
                body={getItemPercent}
              ></Column>
              
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      <AddButtons className="addDryPlus">
        <Dropdown
          id="addIng"
          optionLabel="addIng"
          options={addIngs}
          style={{ width: "50%" }}
          onChange={handleAddPick}
          placeholder={selectedAdd !== "" ? selectedAdd : "Select a Add Mix"}
        />
        <Button
          className="p-button-rounded p-button-outlined"
          icon="pi pi-plus"
          onClick={handleAddAdd}
          
        />
      </AddButtons>
      <div className="datatable-templating-demo">
        <div className="card">
          {posts.length > 0 ? (
            <DataTable value={posts} className="p-datatable-sm">
              <Column field="ing" header="Post Mix"></Column>
              <Column
                className="p-text-center"
                header="% flour weights"
                body={handleInput}
              ></Column>
              <Column
                className="p-text-center"
                header="Weight"
                body={directWeight}
              ></Column>
              <Column
                className="p-text-center"
                header="Total %"
                body={getItemPercent}
              ></Column>
           
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      <AddButtons className="addPost">
        <Dropdown
          id="postIng"
          optionLabel="postIng"
          options={postIngs}
          style={{ width: "50%" }}
          onChange={handlePostPick}
          placeholder={selectedPost !== "" ? selectedPost : "Select a Post Mix"}
        />
        <Button
          className="p-button-rounded p-button-outlined"
          icon="pi pi-plus"
          onClick={handleAddPost}
        />
      </AddButtons>
    </React.Fragment>
  );
};

export default Info;
