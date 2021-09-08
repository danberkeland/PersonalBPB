import React, { useContext, useEffect, useState } from "react";

import TrashCan from "./BuildCurrentCartListParts/TrashCan";
import Product from "./BuildCurrentCartListParts/Product";
import Previous from "./BuildCurrentCartListParts/Previous";
import Rate from "./BuildCurrentCartListParts/Rate"
import Total from "./BuildCurrentCartListParts/Total"

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";

import { buildCurrentOrder } from "../../../../helpers/CartBuildingHelpers";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";
import { getRate } from "../../../../helpers/billingGridHelpers";

const OrderGrid = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  border: none;
  display: grid;
  align-items: center;
  grid-template-columns: 0.5fr 2fr 0.5fr 0.5fr .75fr 0.5fr;
  row-gap: 4px;
  flex-shrink: 1;
`;
const TrashCanContainer = styled.div`
  background-color: transparent;
  border: none;
`;

const BuildCurrentCartList = ({ database, setDatabase }) => {
  const [grandTotal, setGrandTotal] = useState()
  const [products, customers, routes, standing, orders, d, dd, altPricing] = database;
  const {
    chosen,
    delivDate,
    currentCartList,
    setCurrentCartList,
    ponote,
    route,
  } = useContext(CurrentDataContext);

  const {
    reload,
    setModifications
  } = useContext(ToggleContext)

  useEffect(() => {
    if (database.length > 0) {
      if (chosen !== "  ") {
        let currentOrderList = buildCurrentOrder(
          chosen,
          delivDate,
          orders,
          standing,
          route,
          ponote
        );
       
        for (let curr in currentOrderList){
          if (curr.SO !== curr.qty){
            setModifications(true)
          }
        }
        setCurrentCartList(currentOrderList);
       
      }
    }
    
  }, [chosen, delivDate, orders, standing, reload]);

  useEffect (() => {
    if (currentCartList.length>0){
      let grandTotal = 0;
  
    for (let ord in currentCartList){
      console.log("grand",grandTotal)
      grandTotal = grandTotal + getRate(products,currentCartList[ord],altPricing)*currentCartList[ord].qty
    }

    setGrandTotal(grandTotal.toFixed(2))

    }
    
  },[currentCartList])
  
  
  return (
    <React.Fragment>
      <OrderGrid>
        <label></label>
        <label>PRODUCT</label>
        <label>QTY</label>
        <label>PREV</label>
        <label>RATE</label>
        <label>TOTAL</label>
        {currentCartList.filter(curr => curr.qty !==0).map((order) => (
          <React.Fragment key={uuidv4() + "b"}>
            <TrashCanContainer>
              <TrashCan order={order} database={database} setDatabase={setDatabase} />
            </TrashCanContainer>

            <Product order={order} database={database} setDatabase={setDatabase}/>
            <Previous order={order}/>
            <Rate order={order} database={database} />
            <Total order={order} database={database} />
              
          </React.Fragment>
        ))}
        <label></label>
        <label></label>
        <label></label>
        <label></label>
        <label>GRAND TOTAL</label>
        <label>$ {grandTotal}</label>
      </OrderGrid>
    </React.Fragment>
  );
};

export default BuildCurrentCartList;
