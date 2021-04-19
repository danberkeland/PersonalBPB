import React, { useContext, useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { CustomerContext } from "../../dataContexts/CustomerContext";
import {
  ProductsContext,
  ProductsLoad,
} from "../../dataContexts/ProductsContext";
import { OrdersContext } from "../../dataContexts/OrdersContext";
import { StandingContext } from "../../dataContexts/StandingContext";
import { HoldingContext } from "../../dataContexts/HoldingContext";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin: auto;
`;

const BagGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
`;

const EaGrid = styled.div`
  display: grid;

  grid-template-columns: 3fr 1fr;
`;

function EODCounts({ loc }) {
  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);
  const { setCustLoaded } = useContext(CustomerContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  const [eodProds, setEODProds] = useState();

  useEffect(() => {
    if (!products) {
      setProdLoaded(false);
    }
    setCustLoaded(true);
    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  useEffect(() => {
    let prodsToMap = products.filter(
      (prod) => prod.bakedWhere[0] === loc && prod.eodCount === true
    );
    setEODProds(prodsToMap);
  }, [products]);

  const handleInput = () => {
    return (
      <InputText
        style={{
          width: "50px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
        }}
      />
    );
  };

  return (
    <React.Fragment>
      <WholeBox>
        {!prodLoaded ? <ProductsLoad /> : ""}
        {loc === "Prado" ? <h1>BPBS EOD Counts</h1> : <h1>BPBN EOD Counts</h1>}
        <h2>On Shelf</h2>
        {eodProds && (
          <DataTable
            value={eodProds.filter(
              (prods) =>
                prods.freezerThaw !== true && Number(prods.packSize) > 1
            )}
            className="p-datatable-sm"
          >
            <Column field="prodName" header="By Bag"></Column>
            <Column
              className="p-text-center"
              header="# of bags"
              body={(e) => handleInput(e)}
            ></Column>
            <Column className="p-text-center" header="ea"></Column>
          </DataTable>
        )}
        {eodProds && (
          <DataTable
            value={eodProds.filter(
              (prods) =>
                prods.freezerThaw !== true && Number(prods.packSize) === 1
            )}
            className="p-datatable-sm"
          >
            <Column field="prodName" header="Each"></Column>

            <Column
              className="p-text-center"
              header="ea"
              body={(e) => handleInput(e)}
            ></Column>
          </DataTable>
        )}

        <h2>In Freezer</h2>

        {eodProds && (
          <DataTable
            value={eodProds.filter(
              (prods) =>
                prods.freezerThaw !== false && Number(prods.packSize) > 1
            )}
            className="p-datatable-sm"
          >
            <Column field="prodName" header="In Freezer"></Column>

            <Column
              className="p-text-center"
              header="# of bags"
              body={(e) => handleInput(e)}
            ></Column>
            <Column className="p-text-center" header="ea"></Column>
          </DataTable>
        )}

        {eodProds && (
          <DataTable
            value={eodProds.filter(
              (prods) =>
                prods.freezerThaw !== false && Number(prods.packSize) === 1
            )}
            className="p-datatable-sm"
          >
            <Column field="prodName" header="Each"></Column>

            <Column
              className="p-text-center"
              header="ea"
              body={(e) => handleInput(e)}
            ></Column>
          </DataTable>
        )}
      </WholeBox>
    </React.Fragment>
  );
}

export default EODCounts;
