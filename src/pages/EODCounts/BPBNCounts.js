import React, { useContext, useEffect, useState } from "react";

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
width: 50%;
margin: auto;

`

const BagGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  
`;

const EaGrid = styled.div`
  display: grid;
 
  grid-template-columns: 3fr 1fr;
`;

function BPBNCounts() {
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
      (prod) => prod.bakedWhere[0] === "Carlton" && prod.eodCount === true
    );
    setEODProds(prodsToMap);
  }, [products]);

  return (
    <React.Fragment>
      <WholeBox>
      {!prodLoaded ? <ProductsLoad /> : ""}
      <h1>BPBN EOD Counts</h1>
      <h2>On Shelf</h2>
      <h3>By Bag</h3>
      <BagGrid>
        {eodProds
          ? eodProds
              .filter(
                (prods) =>
                  prods.freezerThaw !== true && Number(prods.packSize) > 1
              )
              .map((eod) => (
                <React.Fragment>
                  <div key={eod.prodName}>{eod.prodName}</div>
                  <div>123</div>
                  <div>123</div>
                </React.Fragment>
              ))
          : ""}
      </BagGrid>

      <h3>Each</h3>
      <EaGrid>
        {eodProds
          ? eodProds
              .filter(
                (prods) =>
                  prods.freezerThaw !== true && Number(prods.packSize) === 1
              )
              .map((eod) => (
                <React.Fragment>
                  <div key={eod.prodName}>{eod.prodName}</div>
                  <div>123</div>
                </React.Fragment>
              ))
          : ""}
      </EaGrid>

      <h2>In Freezer</h2>
      <h3>By Bag</h3>
      <BagGrid>
        {eodProds
          ? eodProds
              .filter(
                (prods) =>
                  prods.freezerThaw === true && Number(prods.packSize) > 1
              )
              .map((eod) => (
                <React.Fragment>
                  <div key={eod.prodName}>{eod.prodName}</div>
                  <div>123</div>
                  <div>123</div>
                </React.Fragment>
              ))
          : ""}
      </BagGrid>

      <h3>Each</h3>
      <EaGrid>
        {eodProds
          ? eodProds
              .filter(
                (prods) =>
                  prods.freezerThaw === true && Number(prods.packSize) === 1
              )
              .map((eod) => (
                <React.Fragment>
                  <div key={eod.prodName}>{eod.prodName}</div>
                  <div>123</div>
                </React.Fragment>
              ))
          : ""}
      </EaGrid>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNCounts;
