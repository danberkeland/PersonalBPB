import React, { useState, useEffect, useContext } from "react";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { promisedData } from "../../helpers/databaseFetchers";
import ComposeCroixInfo from "./BPBSWhatToMakeUtils/composeCroixInfo";

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

const clonedeep = require("lodash.clonedeep");

function CroixToMake() {
  const { setIsLoading } = useContext(ToggleContext);

  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [mod, setMod] = useState(false);
  const [modType, setModType] = useState();
  const [openingCount, setOpeningCount] = useState();
  const [openingNorthCount, setOpeningNorthCount] = useState();
  const [makeCount, setMakeCount] = useState();
  const [closingCount, setClosingCount] = useState();
  const [closingNorthCount, setClosingNorthCount] = useState();
  const [products, setProducts] = useState();

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherCroixInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherCroixInfo = (database) => {
    let makeData = compose.returnCroixBreakDown(database, delivDate);
    setOpeningCount(makeData.openingCount);
    setOpeningNorthCount(makeData.openingNorthCount);
    setMakeCount(makeData.makeCount);
    setClosingCount(makeData.closingCount);
    setClosingNorthCount(makeData.closingNorthCount);
    setProducts(makeData.products);
  };
  const openingHeader = <div>Opening South</div>;
  const closeHeader = <div>Closing South</div>;

  const openingNorthHeader = <div>Opening North</div>;
  const closeNorthHeader = <div>Closing North</div>;

  const Toggle = (e, which) => {
    let newMod = clonedeep(mod);
    if (newMod === true) {
      submitNewNumbers(which);
    }
    console.log("mod", newMod);
    setMod(!newMod);
    setModType(which);
  };

  const submitNewNumbers = async (which) => {
    
    let prodToMod = clonedeep(products);
    if (which === "opening") {
      setIsLoading(true);
      for (let op of openingCount) {
        for (let prod of prodToMod) {
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

    if (which === "closing") {
      for (let op of closingCount) {
        for (let prod of prodToMod) {
          // if op.prodName === prod.forBake, prod.freezerCount = op.qty
        }
      }
    }

    if (which === "openingNorth") {
      setIsLoading(true);
      for (let op of openingNorthCount) {
        for (let prod of prodToMod) {
          let itemUpdate;
          if (op.prod === prod.forBake) {
            console.log("updating "+prod)
            itemUpdate = {
              id: prod.id,
              freezerNorth: op.qty,
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

    if (which === "closingNorth") {
      for (let op of closingNorthCount) {
        for (let prod of prodToMod) {
          // if op.prodName === prod.forBake, prod.freezerCount = op.qty
        }
      }
    }
  };

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

  const modifyNorthOpening = (
    <Button onClick={(e) => Toggle(e, "openingNorth")}>
      {mod && modType === "openingNorth" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
  );
  const modifyNorthClosing = (
    <Button onClick={(e) => Toggle(e, "closingNorth")}>
      {mod && modType === "closingNorth" ? (
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
      let cloneOpeningCount = clonedeep(openingCount);
      for (let op of cloneOpeningCount) {
        if (op.prod === prod) {
          op.qty = e.target.value;
        }
      }
      setOpeningCount(cloneOpeningCount);
    }
   
    if (which === "closing") {
    }
    if (which === "openingNorth") {
      let cloneOpeningNorthCount = clonedeep(openingNorthCount);
      for (let op of cloneOpeningNorthCount) {
        if (op.prod === prod) {
          op.qty = e.target.value;
        }
      }
      setOpeningNorthCount(cloneOpeningNorthCount);
    }
   
    if (which === "closingNorth") {
    }
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>Croissant Freezer Count</h1>
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
          <ThreeColumnGrid>
            <BorderBox>
              <DataTable
                id="openingNorthCount"
                value={openingNorthCount}
                header={openingNorthHeader}
                footer={modifyNorthOpening}
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
                {mod && modType === "openingNorth" ? (
                  <Column
                    header="Qty"
                    id="openingNorth"
                    body={(e) => handleInput(e, "openingNorth")}
                  ></Column>
                ) : (
                  <Column field="qty" header="Qty"></Column>
                )}
              </DataTable>
            </BorderBox>

            <BorderBox>
              <DataTable
                id="closingNorthCount"
                value={closingNorthCount}
                header={closeNorthHeader}
                footer={modifyNorthClosing}
              >
                {mod && modType === "closingNorth" && (
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
                {mod && modType === "closingNorth" ? (
                  <Column
                    field="qty"
                    header="Qty"
                    id="closingNorth"
                    body={(e) => handleInput(e, "closingNorth")}
                  ></Column>
                ) : (
                  <Column field="qty" header="Qty" id="closingNorth"></Column>
                )}
              </DataTable>
            </BorderBox>
          </ThreeColumnGrid>
        </TwoColumnGrid>
      </WholeBox>
    </React.Fragment>
  );
}

export default CroixToMake;
