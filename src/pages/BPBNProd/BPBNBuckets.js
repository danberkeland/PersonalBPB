import React, { useEffect, useState, useContext } from "react";

import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { API, graphqlOperation } from "aws-amplify";
import { updateProduct } from "../../graphql/mutations";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeWhatToMake from "./BPBNSetOutUtils/composeWhatToMake";

import styled from "styled-components";

const clonedeep = require("lodash.clonedeep");

const { DateTime } = require("luxon");

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
`;

const ButtonWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 60%;
  flex-direction: row;
  justify-content: space-between;
  align-content: left;

  background: #ffffff;
`;

const compose = new ComposeWhatToMake();

function BPBNBuckets() {
  const { setIsLoading } = useContext(ToggleContext);
  const [whatToMake, setWhatToMake] = useState([]);
  

  let delivDate = todayPlus()[0];

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherWhatToMakeInfo(database)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToMakeInfo = (database) => {
    let whatToMakeData = compose.returnWhatToMakeBreakDown(
      delivDate,
      database
      
    );
    setWhatToMake(whatToMakeData.whatToMake);
    
  };

  const updateDBattr = async (id, attr, val) => {
    let addDetails = {
      id: id,
      [attr]: val,
      whoCountedLast: signedIn,
    };
    try {
      await API.graphql(
        graphqlOperation(updateProduct, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on updating product", error);
    }
  };

  const updateItem = (value, itemToUpdate) => {
    let ind = itemToUpdate.findIndex((item) => item.id === value.target.id);

    itemToUpdate[ind].currentStock = value.target.value;
    itemToUpdate[ind].updatedAt = DateTime.now().setZone("America/Los_Angeles");
    itemToUpdate[ind].whoCountedLast = signedIn;

    try {
      let id = value.target.id;
      let val = Number(value.target.value);
      updateDBattr(id, "currentStock", val);
    } catch {
      console.log("error updating attribute.");
    }
  };


  const handleChange = (value) => {
    if (value.code === "Enter") {
      let itemToUpdate = clonedeep(products);
      updateItem(value, itemToUpdate);
      document.getElementById(value.target.id).value = "";

      return itemToUpdate;
    }
  };

  const handleBlur = (value) => {
    let itemToUpdate = clonedeep(products);
    if (value.target.value !== "") {
      updateItem(value, itemToUpdate);
    }
    document.getElementById(value.target.id).value = "";

    return itemToUpdate;
  };

  const handleInput = (e) => {
    return (
      <InputText
        id={e.id}
        style={{
          width: "50px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
        }}
        placeholder={e.currentStock}
        onKeyUp={(e) => e.code === "Enter" && setProducts(handleChange(e))}
        onBlur={(e) => setProducts(handleBlur(e))}
      />
    );
  };

  
  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportPastryPrepPdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Prep List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h2>In Freezer</h2>

        <DataTable
          value={eodProds.filter(
            (prods) => prods.freezerThaw !== false && Number(prods.packSize) > 1
          )}
          className="p-datatable-sm"
        >
          <Column field="prodName" header="In Freezer"></Column>

          <Column
            className="p-text-center"
            header="# of bags"
            body={(e) => handleInput(e)}
          ></Column>
          <Column className="p-text-center" header="ea" body={eaCount}></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNBuckets;
