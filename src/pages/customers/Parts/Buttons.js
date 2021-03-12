import React, { useContext } from "react";

import styled from "styled-components";
import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import { CustomerContext } from "../../../dataContexts/CustomerContext";

import {
  updateCustomer,
  deleteCustomer,
  createCustomer,
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

const handleOrderClick = (e, selectedCustomer) => {
  e &&
    window.open(
      "./Ordering?cartList=true&selectedCustomer=" + selectedCustomer.custName
    );
};

const handleStandClick = (e, selectedCustomer) => {
  e &&
    window.open(
      "./Ordering?cartList=false&selectedCustomer=" + selectedCustomer.custName
    );
};

const Buttons = ({ selectedCustomer, setSelectedCustomer }) => {
  const { setCustLoaded } = useContext(CustomerContext);

  const handleAddCust = () => {
    let custName;
    let nickName;

    swal("Enter Customer Name:", {
      content: "input",
    }).then((value) => {
      custName = value;
      swal(`Enter Nickname for ${value}:`, {
        content: "input",
      }).then((value) => {
        nickName = value;
        const addDetails = {
          nickName: nickName,
          custName: custName,
          zoneName: "",
          addr1: "",
          addr2: "",
          city: "",
          zip: "",
          email: "",
          firstName: "",
          lastName: "",
          phone: "",
          toBePrinted: "",
          toBeEmailed: "",
          terms: "",
          invoicing: "",
        };
        createCust(addDetails, nickName, custName);
      });
    });
  };

  const createCust = async (addDetails, nickName, custName) => {
    try {
      const custData = await API.graphql(
        graphqlOperation(createCustomer, { input: { ...addDetails } })
      );
      let id = custData.data.createCustomer.id;
      let version = custData.data.createCustomer.version;

      const fullDetails = {
        id: id,
        _version: version,
        nickName: nickName,
        custName: custName,
        zoneName: "",
        addr1: "",
        addr2: "",
        city: "",
        zip: "",
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        toBePrinted: "",
        toBeEmailed: "",
        terms: "",
        invoicing: "",
      };

      setCustLoaded(false);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  const updateCust = async () => {
    const updateDetails = {
      id: selectedCustomer["id"],
      nickName: selectedCustomer["nickName"],
      custName: selectedCustomer["custName"],
      zoneName: selectedCustomer["zoneName"],
      addr1: selectedCustomer["addr1"],
      addr2: selectedCustomer["addr2"],
      city: selectedCustomer["city"],
      zip: selectedCustomer["zip"],
      email: selectedCustomer["email"],
      firstName: selectedCustomer["firstName"],
      lastName: selectedCustomer["lastName"],
      phone: selectedCustomer["phone"],
      toBePrinted: selectedCustomer["toBePrinted"],
      toBeEmailed: selectedCustomer["toBeEmailed"],
      terms: selectedCustomer["terms"],
      invoicing: selectedCustomer["invoicing"],
      _version: selectedCustomer["_version"],
    };

    try {
      const custData = await API.graphql(
        graphqlOperation(updateCustomer, { input: { ...updateDetails } })
      );

      swal({
        text: `${custData.data.updateCustomer.custName} has been updated.`,
        icon: "success",
        buttons: false,
        timer: 2000,
      });
      setCustLoaded(false);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  const deleteCustWarn = async () => {
    swal({
      text:
        " Are you sure that you would like to permanently delete this customer?",
      icon: "warning",
      buttons: ["Yes", "Don't do it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete) {
        deleteCust();
      } else {
        return;
      }
    });
  };

  const deleteCust = async () => {
    const deleteDetails = {
      id: selectedCustomer["id"],
      _version: selectedCustomer["_version"],
    };

    try {
      const custData = await API.graphql(
        graphqlOperation(deleteCustomer, { input: { ...deleteDetails } })
      );
      setCustLoaded(false);
      setSelectedCustomer();
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  return (
    <ButtonBox>
      <Button
        label="Add a Customer"
        icon="pi pi-plus"
        onClick={handleAddCust}
        className={"p-button-raised p-button-rounded"}
      />
      <br />
      {selectedCustomer && (
        <React.Fragment>
          <Button
            label="Update Customer"
            icon="pi pi-user-edit"
            onClick={updateCust}
            className={"p-button-raised p-button-rounded p-button-success"}
          />
          <br />
        </React.Fragment>
      )}
      {selectedCustomer && (
        <React.Fragment>
          <Button
            label="Delete Customer"
            icon="pi pi-user-minus"
            onClick={deleteCustWarn}
            className={"p-button-raised p-button-rounded p-button-warning"}
          />
          <br />
          <br />
        </React.Fragment>
      )}
      {selectedCustomer && (
        <React.Fragment>
          <Button
            id="order"
            label="Tomorrow's Order"
            icon="pi pi-shopping-cart"
            onClick={(e) => {
              handleOrderClick(e, selectedCustomer);
            }}
            className={"p-button-raised p-button-rounded p-button-info"}
            disabled={selectedCustomer.custName ? false : true}
          />
          <br />
        </React.Fragment>
      )}
      {selectedCustomer && (
        <React.Fragment>
          <Button
            label="Edit Standing Order"
            icon="pi pi-calendar"
            onClick={(e) => {
              handleStandClick(e, selectedCustomer);
            }}
            className={"p-button-raised p-button-rounded p-button-info"}
            disabled={selectedCustomer.custName ? false : true}
          />
          <br />
        </React.Fragment>
      )}
    </ButtonBox>
  );
};

export default Buttons;
