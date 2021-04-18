import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import { CustomerContext } from "../../../dataContexts/CustomerContext";
import { OrdersContext } from "../../../dataContexts/OrdersContext";
import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { StandingContext } from "../../../dataContexts/StandingContext";
import { HoldingContext } from "../../../dataContexts/HoldingContext";

import DoughList from "./DoughList";
import Info from "./Info";
import Buttons from "./Buttons";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
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

function EditDoughs() {
  const [selectedDough, setSelectedDough] = useState();
  const [doughs, setDoughs] = useState(null);
  const [doughComponents, setDoughComponents] = useState(null);
  const [isModified, setIsModified] = useState(false)
  const [isReload,setIsReload] = useState(false)

  const { setCustLoaded } = useContext(CustomerContext);
  const { setProdLoaded } = useContext(ProductsContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  useEffect(() => {
    setCustLoaded(true);
    setProdLoaded(true);
    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  return (
    <React.Fragment>
      <MainWrapper>
        <DoughList
          selectedDough={selectedDough}
          setSelectedDough={setSelectedDough}
          doughs={doughs}
          setDoughs={setDoughs}
          doughComponents={doughComponents}
          setDoughComponents={setDoughComponents}
          isReload={isReload}
          setIsReload={setIsReload}
          setIsModified={setIsModified}
        />
        {selectedDough && (
          <React.Fragment>
            <DescripWrapper>
              <GroupBox id="Info">
                <Info
                  selectedDough={selectedDough}
                  setSelectedDough={setSelectedDough}
                  doughComponents={doughComponents}
                  setDoughComponents={setDoughComponents}
                  isModified={isModified}
                  setIsModified={setIsModified}
                />
              </GroupBox>
            </DescripWrapper>
          </React.Fragment>
        )}
        <DescripWrapper>
          <Buttons
            selectedDough={selectedDough}
            setSelectedDough={setSelectedDough}
            doughs={doughs}
            setDoughs={setDoughs}
            doughComponents={doughComponents}
            setDoughComponents={setDoughComponents}
            isModified={isModified}
            setIsModified={setIsModified}
            isReload={isReload}
            setIsReload={setIsReload}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}
export default EditDoughs;
