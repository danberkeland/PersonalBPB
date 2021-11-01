import React, { useContext } from "react";

import styled from "styled-components";
import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import {
  updateProduct,
  deleteProduct,
  createProduct,
} from "../../../graphql/mutations";

import { Button } from "primereact/button";

import { API, graphqlOperation } from "aws-amplify";
import { listInfoQBAuths } from "../../../graphql/queries";

import { v4 as uuidv4 } from "uuid";

const axios = require("axios").default;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 80%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

const Buttons = ({ selectedProduct, setSelectedProduct }) => {
  const { setProdLoaded } = useContext(ProductsContext);
  const { setIsLoading } = useContext(ToggleContext)

  const handleAddProd = () => {
    let prodName;
    let nickName;
    let addDetails;
    let newID;

    swal("Enter Product Name:", {
      content: "input",
    }).then((value) => {
      prodName = value;
      swal(`Enter Nickname for ${value}:`, {
        content: "input",
      }).then(async (value) => {
        nickName = value;
        addDetails = {
          qbID: newID,
          prodName: prodName,
          nickName: nickName,
          packGroup: "",
          packSize: 0,
          doughType: "",
          freezerThaw: false,
          packGroupOrder: 0,
          readyTime: 15,
          bakedWhere: [""],
          wholePrice: 0,
          retailPrice: 0,
          isWhole: false,
          depends: [""],
          weight: 0,
          descrip: "description",
          picURL: "",
          squareID: "",
          currentStock: 0,
          whoCountedLast: "",
          eodCount: false,
          forBake: prodName,
          bakeExtra: 0,
          batchSize: 1,
          defaultInclude: false,
          leadTime: 3,
        };
        setIsLoading(true)
        await createQBProd(addDetails).then((data) => {
          newID = data;
        });

        addDetails.qbID = newID;

        createProd(addDetails);
        
      });
    });
  };

  const createQBProd = async (addDetails, SyncToken) => {
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
      Name: addDetails.prodName,
      Active: true,
      FullyQualifiedName: addDetails.prodName,
      Taxable: false,
      UnitPrice: addDetails.wholePrice,
      Type: "Service",
      IncomeAccountRef: {
        value: "56",
        name: "Uncategorized Income",
      },
      PurchaseCost: 0,
      ExpenseAccountRef: {
        value: "57",
        name: "Outside Expense",
      },
      TrackQtyOnHand: false,
      domain: "QBO",
      sparse: false,
      SyncToken: Sync,
    };

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
          itemType: "Item"
        })
        .then((data) => {
          res = data.data;
        });
    } catch {
      console.log("Error creating Item " + addDetails.prodName);
    }

    return res;
  };

  const createProd = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createProduct, { input: { ...addDetails } })
      );
      setProdLoaded(false);
      setIsLoading(false)
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  const updateProd = async () => {
    let newID;
    let SyncToken;
    setIsLoading(true)

    const updateDetails = {
      qbID: selectedProduct["qbID"],
      id: selectedProduct["id"],
      _version: selectedProduct["_version"],
      prodName: selectedProduct["prodName"],
      nickName: selectedProduct["nickName"],
      packGroup: selectedProduct["packGroup"],
      packSize: selectedProduct["packSize"],
      doughType: selectedProduct["doughType"],
      freezerThaw: selectedProduct["freezerThaw"],
      eodCount: selectedProduct["eodCount"],
      packGroupOrder: selectedProduct["packGroupOrder"],
      readyTime: selectedProduct["readyTime"],
      bakedWhere: selectedProduct["bakedWhere"],
      wholePrice: selectedProduct["wholePrice"],
      retailPrice: selectedProduct["retailPrice"],
      isWhole: selectedProduct["isWhole"],
      depends: selectedProduct["depends"],
      weight: selectedProduct["weight"],
      descrip: selectedProduct["descrip"],
      picURL: selectedProduct["picURL"],
      squareID: selectedProduct["squareID"],
      currentStock: selectedProduct["currentStock"],
      whoCountedLast: selectedProduct["whoCountedLast"],
      forBake: selectedProduct["forBake"],
      bakeExtra: selectedProduct["bakeExtra"],
      batchSize: selectedProduct["batchSize"],
      defaultInclude: selectedProduct["defaultInclude"],
      leadTime: selectedProduct["leadTime"],
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

    console.log("updateQBID",updateDetails.qbID)
    console.log(access)
    try {
      await axios
        .post("https://sntijvwmv6.execute-api.us-east-2.amazonaws.com/done", {
          accessCode: "Bearer " + access,
          itemInfo: updateDetails.qbID,
          itemType: "Item"
        })
        .then((data) => {
          SyncToken = data.data;
          console.log("data",data.data)
        });
    } catch {
      console.log("Error creating Item " + updateDetails.prodName);
    }
    

    await createQBProd(updateDetails, SyncToken).then((data) => {
      newID = data;
    });

    updateDetails.qbID = newID;
    console.log("newID",newID)
    
    try {
      await API.graphql(
        graphqlOperation(updateProduct, { input: { ...updateDetails } })
      );
      setProdLoaded(false);
      setIsLoading(false)
    } catch (error) {
      console.log("error on updating products", error);
    }

    swal({
      text: `${updateDetails.prodName} has been updated.`,
      icon: "success",
      buttons: false,
      timer: 2000,
    });
    
  };

  const deleteProdWarn = async () => {
    swal({
      text: " Are you sure that you would like to permanently delete this product?",
      icon: "warning",
      buttons: ["Yes", "Don't do it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete) {
        deleteProd();
      } else {
        return;
      }
    });
  };

  const deleteProd = async () => {
    const deleteDetails = {
      id: selectedProduct["id"],
      _version: selectedProduct["_version"],
    };

    try {
      await API.graphql(
        graphqlOperation(deleteProduct, { input: { ...deleteDetails } })
      );
      setProdLoaded(false);
      setSelectedProduct();
    } catch (error) {
      console.log("error on fetching Prod List", error);
    }
  };

  return (
    <ButtonBox>
      <Button
        label="Add a Product"
        icon="pi pi-plus"
        onClick={handleAddProd}
        className={"p-button-raised p-button-rounded"}
      />
      <br />
      {selectedProduct && (
        <React.Fragment>
          <Button
            label="Update Product"
            icon="pi pi-user-edit"
            onClick={updateProd}
            className={"p-button-raised p-button-rounded p-button-success"}
          />
          <br />
        </React.Fragment>
      )}
      {selectedProduct && (
        <React.Fragment>
          <Button
            label="Delete Product"
            icon="pi pi-user-minus"
            onClick={deleteProdWarn}
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
