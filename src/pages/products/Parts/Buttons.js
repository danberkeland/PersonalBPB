import React, { useContext } from "react";

import styled from "styled-components";
import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import { ProductsContext } from "../../../dataContexts/ProductsContext";

import {
  updateProduct,
  deleteProduct,
  createProduct,
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

const Buttons = ({ selectedProduct, setSelectedProduct }) => {
  const { setProdLoaded } = useContext(ProductsContext);

  const handleAddProd = () => {
    let prodName;
    let nickName;

    swal("Enter Product Name:", {
      content: "input",
    }).then((value) => {
      prodName = value;
      swal(`Enter Nickname for ${value}:`, {
        content: "input",
      }).then((value) => {
        nickName = value;
        const addDetails = {
          qbID: null,
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
        addDetails.qbID = createQBProd(addDetails);
        createProd(addDetails, nickName, prodName)
      });
    });
  };

  const createQBProd = (addDetails) => {
   
    let timeNow = new Date().toISOString()
    let QBDetails = {
      Item: {
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
        SyncToken: "0",
        MetaData: {
          CreateTime: "2016-12-30T20:01:37-08:00",
          LastUpdatedTime: "2016-12-30T20:01:37-08:00",
        },
      },
      time: timeNow,
    };

    if (addDetails.qbID === null || addDetails.qbID.includes("error")){
      console.log("no ID")
    //     create new QB Product
         return "filler ID"  // qbID
    } else {
      console.log("yes, ID")
      QBDetails.Item["Id"] = addDetails.qbID
      console.log(QBDetails)
      // else, update according to qbID
      
    }
  };

  const createProd = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createProduct, { input: { ...addDetails } })
      );
      setProdLoaded(false);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  const updateProd = async () => {
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

    createQBProd(updateDetails)

    try {
      const prodData = await API.graphql(
        graphqlOperation(updateProduct, { input: { ...updateDetails } })
      );

      swal({
        text: `${prodData.data.updateProduct.prodName} has been updated.`,
        icon: "success",
        buttons: false,
        timer: 2000,
      });
      setProdLoaded(false);
    } catch (error) {
      console.log("error on fetching Prod List", error);
    }
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
