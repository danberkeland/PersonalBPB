import React, { useContext, useEffect } from "react";

import TrashCan from "./BuildCurrentCartListParts/TrashCan";
import Product from "./BuildCurrentCartListParts/Product";
import Previous from "./BuildCurrentCartListParts/Previous"

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";

import { buildCurrentOrder } from "../../../../helpers/CartBuildingHelpers";

const OrderGrid = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  border: none;
  display: grid;
  align-items: center;
  grid-template-columns: 0.5fr 3fr 0.5fr 0.5fr;
  row-gap: 4px;
  flex-shrink: 1;
`;
const TrashCanContainer = styled.div`
  background-color: transparent;
  border: none;
`;

const BuildCurrentCartList = ({ database }) => {
  const [products, customers, routes, standing, orders] = database;
  const {
    chosen,
    delivDate,
    currentCartList,
    setCurrentCartList,
    ponote,
    route,
  } = useContext(CurrentDataContext);

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
        currentOrderList = currentOrderList.filter(
          (order) => order["qty"] !== 0
        );

        setCurrentCartList(currentOrderList);
      }
    }
  }, [chosen, delivDate, orders, standing]);

  
  return (
    <React.Fragment>
      <OrderGrid>
        <label></label>
        <label>PRODUCT</label>
        <label>QTY</label>
        <label>PREV</label>
        {currentCartList.map((order) => (
          <React.Fragment key={uuidv4() + "b"}>
            <TrashCanContainer>
              <TrashCan order={order} />
            </TrashCanContainer>

            <Product order={order} />
            <Previous order={order}/>
              
          </React.Fragment>
        ))}
      </OrderGrid>
    </React.Fragment>
  );
};

export default BuildCurrentCartList;
