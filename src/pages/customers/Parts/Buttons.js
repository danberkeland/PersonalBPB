import React, { useContext } from "react";

import styled from "styled-components";
import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import { CustomerContext } from "../../../dataContexts/CustomerContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import {
  updateCustomer,
  deleteCustomer,
  createCustomer,
} from "../../../graphql/mutations";

import { Button } from "primereact/button";

import { API, graphqlOperation } from "aws-amplify";
import { listInfoQBAuths } from "../../../graphql/queries";

const axios = require("axios").default;

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
  const { setIsLoading } = useContext(ToggleContext);

  const handleAddCust = () => {
    let custName;
    let nickName;
    let addDetails;
    let newID;

    swal("Enter Customer Name:", {
      content: "input",
    }).then((value) => {
      custName = value;
      swal(`Enter Nickname for ${value}:`, {
        content: "input",
      }).then(async(value) => {
        nickName = value;
        addDetails = {
          qbID: newID,
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
          latestFirstDeliv: 10,
          latestFinalDeliv: 10
        };
       
        setIsLoading(true)
        await createQBCust(addDetails).then((data) => {
          newID = data;
        });

        addDetails.qbID = newID;

        createCust(addDetails);
      });
    });
  };

  const createQBCust = async (addDetails, SyncToken) => {
    let Sync = "0"
    if (SyncToken){
      Sync = SyncToken
    }
    console.log("Sync",Sync)
    let access;
    let val = await axios.get(
      "https://28ue1wrzng.execute-api.us-east-2.amazonaws.com/done"
    );

    if (val.data) {
      let authData = await API.graphql(
        graphqlOperation(listInfoQBAuths, { limit: "50" })
      );
      access = authData.data.listInfoQBAuths.items[0].infoContent;

      console.log(access);
    } else {
      console.log("not valid QB Auth");
    }

    let QBDetails = {
      FullyQualifiedName: addDetails.custName, 
      PrimaryEmailAddr: {
        Address: addDetails.email
      }, 
      DisplayName: addDetails.custName, 
      PrimaryPhone: {
        FreeFormNumber: addDetails.phone
      }, 
      CompanyName: addDetails.custName, 
      BillAddr: {
        CountrySubDivisionCode: "CA", 
        City: addDetails.city, 
        PostalCode: addDetails.zip, 
        Line1: addDetails.addr1, 
        Line2: addDetails.addr2, 
        Country: "USA"
      }, 
      sparse: false,
      SyncToken: Sync
    }

    try{
      if(Number(addDetails.qbID)>0){
        QBDetails.Id = addDetails.qbID
      }
    } catch {}
    console.log("QBDetails",QBDetails)
    let res;

    try {
      await axios
        .post("https://brzqs4z7y3.execute-api.us-east-2.amazonaws.com/done", {
          accessCode: "Bearer " + access,
          itemInfo: QBDetails,
          itemType: "Customer"
        })
        .then((data) => {
          res = data.data;
        });
    } catch {
      console.log("Error creating Item " + addDetails.custName);
    }

    return res;
  };

  const createCust = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createCustomer, { input: { ...addDetails } })
      );
      

      setCustLoaded(false);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  const updateCust = async () => {
    let newID;
    let SyncToken;
    setIsLoading(true)

    const updateDetails = {
      qbID: selectedCustomer["qbID"],
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
      printDuplicate: selectedCustomer["printDuplicate"],
      terms: selectedCustomer["terms"],
      invoicing: selectedCustomer["invoicing"],
      latestFirstDeliv: selectedCustomer["latestFirstDeliv"],
      latestFinalDeliv: selectedCustomer["latestFinalDeliv"],
      _version: selectedCustomer["_version"],
    };
    console.log(updateDetails);

    let access;
    let val = await axios.get(
      "https://28ue1wrzng.execute-api.us-east-2.amazonaws.com/done"
    );

    if (val.data) {
      let authData = await API.graphql(
        graphqlOperation(listInfoQBAuths, { limit: "50" })
      );
      access = authData.data.listInfoQBAuths.items[0].infoContent;

      console.log(access);
    } else {
      console.log("not valid QB Auth");
    }


    try {
      await axios
        .post("https://sntijvwmv6.execute-api.us-east-2.amazonaws.com/done", {
          accessCode: "Bearer " + access,
          itemInfo: updateDetails.qbID,
          itemType: "Customer"
        })
        .then((data) => {
          SyncToken = data.data;
        });
    } catch {
      console.log("Error creating Item " + updateDetails.custName);
    }
    

    await createQBCust(updateDetails, SyncToken).then((data) => {
      newID = data;
    });

    updateDetails.qbID = newID;
    console.log("newID",newID)
    
    try {
      await API.graphql(
        graphqlOperation(updateCustomer, { input: { ...updateDetails } })
      );
      setCustLoaded(false);
      setIsLoading(false)
    } catch (error) {
      console.log("error on updating products", error);
    }

    swal({
      text: `${updateDetails.custName} has been updated.`,
      icon: "success",
      buttons: false,
      timer: 2000,
    });
  };

  const deleteCustWarn = async () => {
    swal({
      text: " Are you sure that you would like to permanently delete this product?",
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
      await API.graphql(
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
