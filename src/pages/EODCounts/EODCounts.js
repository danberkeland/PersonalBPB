import React, { useContext, useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";

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

  return (
    <React.Fragment>
      <WholeBox>
        {!prodLoaded ? <ProductsLoad /> : ""}
        {loc === "Prado" ? <h1>BPBS EOD Counts</h1> : <h1>BPBN EOD Counts</h1>}
        <h2>On Shelf</h2>

        <BagGrid>
          <h3>By Bag</h3>
          <h3># of bags</h3>
          <h3>ea</h3>
          {eodProds
            ? eodProds
                .filter(
                  (prods) =>
                    prods.freezerThaw !== true && Number(prods.packSize) > 1
                )
                .map((eod) => (
                  <React.Fragment>
                    <div key={eod.prodName}>{eod.prodName}</div>
                    <InputText
                      style={{
                        width: "50px",
                        backgroundColor: "#E3F2FD",
                        fontWeight: "bold",
                      }}
                    />
                    <div>123</div>
                  </React.Fragment>
                ))
            : ""}
        </BagGrid>

        <EaGrid>
          <h3>Each</h3>
          <h3>ea</h3>
          {eodProds
            ? eodProds
                .filter(
                  (prods) =>
                    prods.freezerThaw !== true && Number(prods.packSize) === 1
                )
                .map((eod) => (
                  <React.Fragment>
                    <div key={eod.prodName}>{eod.prodName}</div>
                    <InputText
                      style={{
                        width: "50px",
                        backgroundColor: "#E3F2FD",
                        fontWeight: "bold",
                      }}
                    />
                  </React.Fragment>
                ))
            : ""}
        </EaGrid>

        <h2>In Freezer</h2>

        <BagGrid>
          <h3>By Bag</h3>
          <h3># of bags</h3>
          <h3>ea</h3>
          {eodProds
            ? eodProds
                .filter(
                  (prods) =>
                    prods.freezerThaw === true && Number(prods.packSize) > 1
                )
                .map((eod) => (
                  <React.Fragment>
                    <div key={eod.prodName}>{eod.prodName}</div>
                    <InputText
                      style={{
                        width: "50px",
                        backgroundColor: "#E3F2FD",
                        fontWeight: "bold",
                      }}
                    />
                    <div>123</div>
                  </React.Fragment>
                ))
            : ""}
        </BagGrid>

        <EaGrid>
          <h3>Each</h3>
          <h3>ea</h3>
          {eodProds
            ? eodProds
                .filter(
                  (prods) =>
                    prods.freezerThaw === true && Number(prods.packSize) === 1
                )
                .map((eod) => (
                  <React.Fragment>
                    <div key={eod.prodName}>{eod.prodName}</div>
                    <InputText
                      style={{
                        width: "50px",
                        backgroundColor: "#E3F2FD",
                        fontWeight: "bold",
                      }}
                    />
                  </React.Fragment>
                ))
            : ""}
        </EaGrid>
      </WholeBox>
    </React.Fragment>
  );
}

export default EODCounts;
