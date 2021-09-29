import React from "react";

import styled from "styled-components";
import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import { updateAuthSettings, deleteAuthSettings, createAuthSettings } from "../../../graphql/mutations";

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

const Buttons = ({ selectedUser, setSelectedUser }) => {
  const handleAddUser = () => {
    let userName;

    swal("Enter User Name:", {
      content: "input",
    }).then((value) => {
      userName = value;
      const addDetails = {
       
      };
      createUsr(addDetails, userName);
    });
  };

  const createUsr = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createAuthSettings, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on fetching User List", error);
    }
  };

  const updateUsr = async () => {
    const updateDetails = {
      
    };

    try {
      const userData = await API.graphql(
        graphqlOperation(updateAuthSettings, { input: { ...updateDetails } })
      );

      swal({
        text: `${userData.data.updateAuthSettings.businessName} has been updated.`,
        icon: "success",
        buttons: false,
        timer: 2000,
      });
    } catch (error) {
      console.log("error on fetching User List", error);
    }
  };

  const deleteUserWarn = async () => {
    swal({
      text:
        " Are you sure that you would like to permanently delete this user?",
      icon: "warning",
      buttons: ["Yes", "Don't do it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete) {
        deleteUsr();
      } else {
        return;
      }
    });
  };

  const deleteUsr = async () => {
    const deleteDetails = {
      id: selectedUser["id"],
      _version: selectedUser["_version"],
    };

    try {
      await API.graphql(
        graphqlOperation(deleteAuthSettings, { input: { ...deleteDetails } })
      );
      setSelectedUser();
    } catch (error) {
      console.log("error on fetching User List", error);
    }
  };

  return (
    <ButtonBox>
      <Button
        label="Add a User"
        icon="pi pi-plus"
        onClick={handleAddUser}
        className={"p-button-raised p-button-rounded"}
      />
      <br />
      {selectedUser && (
        <React.Fragment>
          <Button
            label="Update User"
            icon="pi pi-map"
            onClick={updateUsr}
            className={"p-button-raised p-button-rounded p-button-success"}
          />
          <br />
        </React.Fragment>
      )}
      {selectedUser && (
        <React.Fragment>
          <Button
            label="Delete User"
            icon="pi pi-minus"
            onClick={deleteUserWarn}
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
