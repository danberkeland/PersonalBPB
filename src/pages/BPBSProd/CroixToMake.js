import React, { useState, useEffect, useContext } from "react";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { promisedData } from "../../helpers/databaseFetchers";
import ComposeCroixInfo from "./BPBSWhatToMakeUtils/composeCroixInfo";
import ComposePastryPrep from "../BPBNProd/Utils/composePastryPrep";

import { todayPlus } from "../../helpers/dateTimeHelpers";

import { updateProduct } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import jsPDF from "jspdf";
import "jspdf-autotable";

import styled from "styled-components";
import { set } from "lodash";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  column-gap: 10px;
  row-gap: 10px;
  padding: 5px;
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 5px;
  row-gap: 10px;
  padding: 0px;
`;

const BorderBox = styled.div`
  border-style: solid;
  border-width: 1px;
  border-color: grey;
`;

const ButtonStyle = styled.button`
  border: 0;
  background-color: #4caf50;
  color: white;
  font-size: 20px;
  border-radius: 15px;
  box-shadow: 0 9px #999;
  &:hover {
    background-color: #3e8e41;
  }
  &:active {
    background-color: #3e8e41;
    box-shadow: 0 5px #666;
    transform: translateY(4px);
  }
`;

const compose = new ComposeCroixInfo();
const composeSetOut = new ComposePastryPrep();

const clonedeep = require("lodash.clonedeep");

function CroixToMake() {
  const { setIsLoading } = useContext(ToggleContext);

  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [mod, setMod] = useState(false);
  const [modType, setModType] = useState();
  const [openingCount, setOpeningCount] = useState();
  const [makeCount, setMakeCount] = useState();
  const [closingCount, setClosingCount] = useState();
  const [projectionCount, setProjectionCount] = useState();
  const [products, setProducts] = useState();
  const [setOut, setSetOut] = useState();

  useEffect(() => {
    promisedData(setIsLoading).then((database) => {
      if (!setOut) {
        gatherPastryPrepInfo(database);
      }
      gatherCroixInfo(database);
    });
  }, [setOut]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherPastryPrepInfo = (database) => {
    let pastryPrepData = composeSetOut.returnPastryPrepBreakDown(
      delivDate,
      database,
      "Prado"
    );
    setSetOut(pastryPrepData.setOut);
  };

  const gatherCroixInfo = (database) => {
    console.log("setOut1", setOut);
    let makeData = compose.returnCroixBreakDown(database, delivDate, setOut);
    setOpeningCount(makeData.openingCount);
    setMakeCount(makeData.makeCount);
    setClosingCount(makeData.closingCount);
    setProjectionCount(makeData.projectionCount);
    setProducts(makeData.products);
  };

  const openingHeader = <div>Opening Freezer</div>;

  const makeHeader = <div>MAKE TODAY</div>;

  const closeHeader = <div>Closing EOD</div>;

  const projectionHeader = <div>EOD Projections</div>;

  const Toggle = (e, which) => {
    console.log(which);
    let newMod = clonedeep(mod);
    if (newMod === true) {
      submitNewNumbers(which);
    }
    console.log("mod", newMod);
    setMod(!newMod);
    setModType(which);
  };

  const submitNewNumbers = async (which) => {
    console.log("Submitting " + which);
    let prodToMod = clonedeep(products);
    if (which === "opening") {
      setIsLoading(true);
      for (let op of openingCount) {
        for (let prod of prodToMod) {
          console.log("op", op);
          console.log("prod", prod);
          let itemUpdate;
          if (op.prod === prod.forBake) {
            itemUpdate = {
              id: prod.id,
              freezerCount: op.qty,
            };

            try {
              await API.graphql(
                graphqlOperation(updateProduct, { input: { ...itemUpdate } })
              );
            } catch (error) {
              console.log("error on updating product", error);
            }
          }
        }
      }
      setIsLoading(false);
    }
    if (which === "sheets") {
      setIsLoading(true);
      for (let op of makeCount) {
        for (let prod of prodToMod) {
          console.log("op", op);
          console.log("prod", prod);
          let itemUpdate;
          if (op.prod === prod.forBake) {
            itemUpdate = {
              id: prod.id,
              sheetMake: op.qty,
            };

            try {
              await API.graphql(
                graphqlOperation(updateProduct, { input: { ...itemUpdate } })
              );
            } catch (error) {
              console.log("error on updating product", error);
            }
          }
        }
      }
      setIsLoading(false);
    }
    if (which === "closing") {
      for (let op of closingCount) {
        for (let prod of prodToMod) {
          // if op.prodName === prod.forBake, prod.freezerCount = op.qty
        }
      }
    }
  };

  const modifySheets = (
    <Button onClick={(e) => Toggle(e, "sheets")}>
      {mod && modType === "sheets" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
  );
  const modifyOpening = (
    <Button onClick={(e) => Toggle(e, "opening")}>
      {mod && modType === "opening" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
  );
  const modifyClosing = (
    <Button onClick={(e) => Toggle(e, "closing")}>
      {mod && modType === "closing" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
  );

  const handleInput = (e, which) => {
    console.log("e", e);

    return (
      <InputText
        className="p-inputtext-sm"
        placeholder={e.qty}
        style={{
          width: "50px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
        }}
        onKeyUp={(e2) => e2.code === "Enter" && setInfo(e2, which, e.prod)}
        onBlur={(e2) => setInfo(e2, which, e.prod)}
      />
    );
  };

  const setInfo = (e, which, prod) => {
    if (which === "opening") {
      console.log(e.target.value, which, prod);
      let cloneOpeningCount = clonedeep(openingCount);
      for (let op of cloneOpeningCount) {
        if (op.prod === prod) {
          op.qty = e.target.value;
        }
      }
      setOpeningCount(cloneOpeningCount);
    }
    if (which === "sheets") {
      console.log(e.target.value, which, prod);
      let cloneMakeCount = clonedeep(makeCount);
      for (let op of cloneMakeCount) {
        if (op.prod === prod) {
          op.qty = e.target.value;
        }
      }
      setMakeCount(cloneMakeCount);
    }
    if (which === "closing") {
    }
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>Croissant Production</h1>
        <h2>Sunday, June 20, 2021</h2>
        <TwoColumnGrid>
          <ThreeColumnGrid>
            <BorderBox>
              <DataTable
                id="openingCount"
                value={openingCount}
                header={openingHeader}
                footer={modifyOpening}
              >
                <Column
                  style={{
                    width: "90px",
                    backgroundColor: "#E3F2FD",
                    fontWeight: "bold",
                  }}
                  field="prod"
                  header="Product"
                ></Column>
                {mod && modType === "opening" ? (
                  <Column
                    header="Qty"
                    id="opening"
                    body={(e) => handleInput(e, "opening")}
                  ></Column>
                ) : (
                  <Column field="qty" header="Qty"></Column>
                )}
              </DataTable>
            </BorderBox>
            <BorderBox>
              <DataTable
                id="makeCount"
                value={makeCount}
                header={makeHeader}
                footer={modifySheets}
              >
                {mod && modType === "sheets" && (
                  <Column
                    style={{
                      width: "90px",
                      backgroundColor: "#E3F2FD",
                      fontWeight: "bold",
                    }}
                    field="prod"
                    header="Prod"
                  ></Column>
                )}
                {mod && modType === "sheets" ? (
                  <Column
                    field="qty"
                    header="Sheets"
                    id="sheets"
                    body={(e) => handleInput(e, "sheets")}
                  ></Column>
                ) : (
                  <Column field="qty" header="Sheets"></Column>
                )}

                {((!mod && modType === "sheets") || modType !== "sheets") && (
                  <Column field="total" header="Total"></Column>
                )}
              </DataTable>
            </BorderBox>
            <BorderBox>
              <DataTable
                id="closingCount"
                value={closingCount}
                header={closeHeader}
                footer={modifyClosing}
              >
                {mod && modType === "closing" && (
                  <Column
                    style={{
                      width: "90px",
                      backgroundColor: "#E3F2FD",
                      fontWeight: "bold",
                    }}
                    field="prod"
                    header="Prod"
                  ></Column>
                )}
                {mod && modType === "closing" ? (
                  <Column
                    field="qty"
                    header="Qty"
                    id="closing"
                    body={(e) => handleInput(e, "closing")}
                  ></Column>
                ) : (
                  <Column field="qty" header="Qty" id="closing"></Column>
                )}
              </DataTable>
            </BorderBox>
          </ThreeColumnGrid>
          <BorderBox>
            <DataTable value={projectionCount} header={projectionHeader}>
              <Column
                style={{
                  width: "90px",
                  backgroundColor: "#E3F2FD",
                  fontWeight: "bold",
                }}
                field="prod"
                header="Product"
              ></Column>
              <Column field="tom" header="TOM"></Column>
              <Column field="2day" header="2DAY"></Column>
              <Column field="3day" header="3DAY"></Column>
              <Column field="4day" header="4DAY"></Column>
            </DataTable>
          </BorderBox>
        </TwoColumnGrid>
      </WholeBox>
    </React.Fragment>
  );
}

export default CroixToMake;
