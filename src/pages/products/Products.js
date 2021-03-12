import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import { CustomerContext } from "../../dataContexts/CustomerContext";
import { 
  ProductsContext,
  ProductsLoad
  } from "../../dataContexts/ProductsContext";
import { OrdersContext } from "../../dataContexts/OrdersContext";
import { StandingContext } from "../../dataContexts/StandingContext";
import { HoldingContext } from "../../dataContexts/HoldingContext";

import ProductList from "./Parts/ProductList";
import Name from "./Parts/Name";
import Location from "./Parts/Location";
import Contact from "./Parts/Contact";
import Billing from "./Parts/Billing";
import Buttons from "./Parts/Buttons";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
  height: 100vh;
`;

const DescripWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-direction: column;
  justify-items: start;
  align-content: flex-start;
  width: 100%;
  background: #ffffff;
`;

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);
  const { setCustLoaded } = useContext(CustomerContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  useEffect(() => {
    if (!products) {
      setProdLoaded(false);
    }
    setCustLoaded(true);
    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  return (
    <React.Fragment>
      {!prodLoaded ? <ProductsLoad /> : ""}
      <MainWrapper>
        <ProductList
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
        {selectedProduct && (
          <React.Fragment>
            <DescripWrapper>
              <GroupBox id="Name">
                <Name
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                />
              </GroupBox>

              <GroupBox id="Location">
                <Location
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                />
              </GroupBox>
            </DescripWrapper>

            <DescripWrapper>
              <GroupBox id="Contact">
                <Contact
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                />
              </GroupBox>

              <GroupBox id="Billing">
                <Billing
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                />
              </GroupBox>
            </DescripWrapper>
          </React.Fragment>
        )}

        <DescripWrapper>
          <Buttons
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default Products;
