import React, { useContext } from "react";

import styled from "styled-components";
import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import { CustomerContext } from "../../../dataContexts/CustomerContext";

import {
  updateAuthSettings,
  deleteAuthSettings,
  createAuthSettings,
  updateCustomer,
} from "../../../graphql/mutations";

import { Button } from "primereact/button";

import { API, graphqlOperation, Auth } from "aws-amplify";

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 80%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

const Buttons = ({ selectedUser, setSelectedUser, target }) => {
  const { customers, setCustLoaded } = useContext(CustomerContext);

  const handleAddUser = () => {
    let userName;
    let tempPassword;
    let phone;
    let email;

    swal("Enter User Name:", {
      content: "input",
    }).then((value) => {
      userName = value;
      swal(`Enter Temporary Password for ${value}:`, {
        content: "input",
      }).then((value) => {
        tempPassword = value;
        swal("Enter Phone Number:", {
          content: "input",
        }).then((value) => {
          phone = value;
          swal("Enter Email:", {
            content: "input",
          }).then((value) => {
            email = value;
            const addDetails = {
              businessName: userName,
              tempPassword: tempPassword,
              tempUsername: userName,
              phone: phone,
              email: email,
            };
            const signUp = {
              username: userName,
              password: tempPassword,
              attributes: {
                preferred_username: userName,
                phone_number: phone,
                email: email,
              },
            };

            createUsr(addDetails, signUp);
          });
        });
      });
    });
  };

  const createUsr = async (addDetails, signUp) => {
    let newbie = await Auth.signUp(signUp);
  
    addDetails.sub = newbie.userSub;

    try {
      await API.graphql(
        graphqlOperation(createAuthSettings, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on fetching User List", error);
    }
  };

  const updateUsr = async () => {
    // for targ in target
    //     find customer
    //     if selectedUser.sub is not in userSubs, push
    //     get customer.id
    //     create updateDetails
    //     update customer

    for (let targ of target) {
      let include = false;
      let ind = customers.findIndex((cust) => cust.custName === targ);
      try {
        if (!customers[ind].userSubs.includes(selectedUser.sub)) {
          include = true;
        }
      } catch {
        include = true;
      }
      
      let newSubs;
      try {
        newSubs = customers[ind].userSubs;
      } catch {
        console.log("don't exist");
      }
      if (!newSubs) {
        newSubs = [];
      }
      if (include === true) {
        newSubs.push(selectedUser.sub);
      }
      let updateDetails = {
        id: customers[ind].id,
        userSubs: newSubs
        
        
      };

      try {
        const userData = await API.graphql(
          graphqlOperation(updateCustomer, { input: { ...updateDetails } })
        );
      } catch (error) {
        console.log("error on fetching User List", error);
      }
    }

    let updateDetails = {
      id: selectedUser.id,
      businessName: selectedUser.businessName,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      phone: selectedUser.phone,
      email: selectedUser.email,
      authType: selectedUser.authType
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
      text: " Are you sure that you would like to permanently delete this user?",
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
