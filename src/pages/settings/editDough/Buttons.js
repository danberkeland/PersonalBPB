import React from "react";

import styled from "styled-components";
import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import {
  updateDough,
  deleteDough,
  createDough,
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
        ingredients: [],
        process: [],
        batchSize: 0,
        mixedWhere: '',
      };
      createDgh(addDetails, doughName);
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
