import React from "react";

import styled from "styled-components";
import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import {
  updateDough,
  deleteDough,
  createDough,
  createDoughComponent,
} from "../../../graphql/mutations";

import { Button } from "primereact/button";

import { API, graphqlOperation } from "aws-amplify";

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 80%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

const Buttons = ({ selectedDough, setSelectedDough }) => {
  const handleAddDough = () => {
    let doughName;

    swal("Enter Dough Name:", {
      content: "input",
    }).then((value) => {
      doughName = value;
      const addDetails = {
        doughName: doughName,
        hydration: 60,
        process: [
          "scale",
          "mix",
          "bulk",
          "divide",
          "shape",
          "proof",
          "bake",
          "cool",
        ],
        batchSize: 60,
        mixedWhere: "Carlton",
        components: ["lev", "dry", "wet", "dryplus"],
      };

      const levComponent = {
        dough: doughName,
        componentType: "lev",
        componentName: "Levain",
        amount: 20,
      };

      const dryComponent = {
        dough: doughName,
        componentType: "dry",
        componentName: "Bread Flour",
        amount: 100,
      };

      const wetComponent = {
        dough: doughName,
        componentType: "wet",
        componentName: "Water",
        amount: 100,
      };

      const saltComponent = {
        dough: doughName,
        componentType: "dryplus",
        componentName: "Salt",
        amount: 2,
      };

      const yeastComponent = {
        dough: doughName,
        componentType: "dryplus",
        componentName: "Yeast",
        amount: 1,
      };

      createDgh(addDetails);
      createDghComp(levComponent);
      createDghComp(dryComponent);
      createDghComp(wetComponent);
      createDghComp(saltComponent);
      createDghComp(yeastComponent);
    });
  };

  const createDgh = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createDough, { input: { ...addDetails } })
      );
      setSelectedDough();
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  const createDghComp = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createDoughComponent, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  const updateDgh = async () => {
    const updateDetails = {
      id: selectedDough.id,
      doughName: selectedDough.doughName,
      ingredients: selectedDough.ingredients,
      process: selectedDough.process,
      batchSize: selectedDough.batchSize,

      _version: selectedDough["_version"],
    };

    try {
      const doughData = await API.graphql(
        graphqlOperation(updateDough, { input: { ...updateDetails } })
      );

      swal({
        text: `${doughData.data.updateDough.doughName} has been updated.`,
        icon: "success",
        buttons: false,
        timer: 2000,
      });
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  const deleteDoughWarn = async () => {
    swal({
      text:
        " Are you sure that you would like to permanently delete this dough?",
      icon: "warning",
      buttons: ["Yes", "Don't do it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete) {
        deleteDgh();
      } else {
        return;
      }
    });
  };

  const deleteDgh = async () => {
    const deleteDetails = {
      id: selectedDough["id"],
      _version: selectedDough["_version"],
    };

    try {
      await API.graphql(
        graphqlOperation(deleteDough, { input: { ...deleteDetails } })
      );
      setSelectedDough();
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  return (
    <ButtonBox>
      <Button
        label="Add a Dough"
        icon="pi pi-plus"
        onClick={handleAddDough}
        className={"p-button-raised p-button-rounded"}
      />
      <br />
      {selectedDough && (
        <React.Fragment>
          <Button
            label="Update Dough"
            icon="pi pi-user-edit"
            onClick={updateDgh}
            className={"p-button-raised p-button-rounded p-button-success"}
          />
          <br />
        </React.Fragment>
      )}
      {selectedDough && (
        <React.Fragment>
          <Button
            label="Delete Dough"
            icon="pi pi-user-minus"
            onClick={deleteDoughWarn}
            className={"p-button-raised p-button-rounded p-button-warning"}
          />
          <br />
          <br />
        </React.Fragment>
      )}
    </ButtonBox>
  );
};

export default Buttons;
