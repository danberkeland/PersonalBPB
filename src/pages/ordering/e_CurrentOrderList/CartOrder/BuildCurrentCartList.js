import React, { useContext, useEffect, useState } from "react";

import TrashCan from "./BuildCurrentCartListParts/TrashCan";
import Product from "./BuildCurrentCartListParts/Product";
import Previous from "./BuildCurrentCartListParts/Previous";
import Rate from "./BuildCurrentCartListParts/Rate";
import Total from "./BuildCurrentCartListParts/Total";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";

import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";

import { buildCurrentOrder } from "../../../../helpers/CartBuildingHelpers";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";
import { getRate } from "../../../../helpers/billingGridHelpers";
import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";
import { sortAtoZDataByIndex } from "../../../../helpers/sortDataHelpers";

const OrderGrid = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  border: none;
  display: grid;
  align-items: center;
  grid-template-columns: 0.5fr 2fr 0.5fr 0.5fr 0.75fr 0.5fr;
  row-gap: 4px;
  flex-shrink: 1;
`;

const OrderGridPhone = styled.div`
  width: 100%;
  
  padding: 10px;
  border: none;
  display: grid;
  align-items: center;
  grid-template-columns: 2.5fr 1fr 1fr;
  row-gap: 2px;
  flex-shrink: 1;
`;

const GrandAlign = styled.div`
  width: 100%;
  
  padding: 10px;
  border: none;
  display: grid;
  align-items: center;
  grid-template-columns: 2.5fr 1fr 1fr;
  row-gap: 2px;
  flex-shrink: 1;
`;

const TotalStyle = styled.div`
  font-size: 1.5em;
`

const PhoneWrap = styled.div`
  border-style: solid;
  border-width: 1px;
  border-color: lightblue;
  margin: 10px;
  `
const TrashCanContainer = styled.div`
  background-color: transparent;
  border: none;
`;

const BuildCurrentCartList = ({ database, setDatabase }) => {
  const [grandTotal, setGrandTotal] = useState();
  const [products, customers, routes, standing, orders, d, dd, altPricing] =
    database;
  const {
    chosen,
    delivDate,
    currentCartList,
    setCurrentCartList,
    ponote,
    route,
  } = useContext(CurrentDataContext);

  const { reload, setModifications } = useContext(ToggleContext);

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

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

        for (let curr of currentOrderList) {
          curr["temp"] = false;
          if (curr.SO !== curr.qty) {
            setModifications(true);
          }
        }
        let template
        try{
          template =
          customers[customers.findIndex((cust) => cust.custName === chosen)]
            .templateProd;
        } catch {
          template =[]
        }
        
        let currentProds =[]
        try{
          currentProds = currentOrderList.map((curr) => curr.prodName);
        } catch {
          currentProds =[]
        }
        try{
          template = template.filter((temp) => !currentProds.includes(temp));
        } catch {
          template = []
        }
       
        for (let temp of template) {
          let tempOrder = {
            custName: chosen,
            delivDate: convertDatetoBPBDate(delivDate),
            isWhole: true,
            prodName: temp,
            SO: 0,
            qty: 0,
            temp: true,
          };
          currentOrderList.push(tempOrder);
          console.log("currentOrderList",currentOrderList)
        }
        sortAtoZDataByIndex(currentOrderList, "prodName");
        setCurrentCartList(currentOrderList);
      }
    }
  }, [chosen, delivDate, orders, standing, reload]);

  useEffect(() => {
    if (currentCartList.length > 0) {
      let grandTotal = 0;

      for (let ord in currentCartList) {
        grandTotal =
          grandTotal +
          getRate(products, currentCartList[ord], altPricing) *
            currentCartList[ord].qty;
      }

      setGrandTotal(grandTotal.toFixed(2));
    }
  }, [currentCartList]);

  const innards1 =(
    <OrderGrid>
        <label></label>
        <label>PRODUCT</label>
        <label>QTY</label>
        <label>PREV</label>
        <label>RATE</label>
        <label>TOTAL</label>
        {currentCartList
          .filter((curr) => curr.qty !== 0 || curr.temp === true)
          .map((order) => (
            <React.Fragment key={uuidv4() + "b"}>
              <TrashCanContainer>
                <TrashCan
                  order={order}
                  database={database}
                  setDatabase={setDatabase}
                />
              </TrashCanContainer>

              <Product
                order={order}
                database={database}
                setDatabase={setDatabase}
              />
              <Previous order={order} />
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
  )

  const innards2 =(
    <React.Fragment>
        
        {currentCartList
          .filter((curr) => curr.qty !== 0 || curr.temp === true)
          .map((order) => (
            <React.Fragment key={uuidv4() + "b"}>
              <PhoneWrap>
              <OrderGridPhone>
              
              <Product
                order={order}
                database={database}
                setDatabase={setDatabase}
              />
              <Previous order={order} />
              </OrderGridPhone>
              <OrderGridPhone>
              <TrashCanContainer>
                <TrashCan
                  order={order}
                  database={database}
                  setDatabase={setDatabase}
                />
              </TrashCanContainer>
               
              <Rate order={order} database={database} />
              
              
              <Total order={order} database={database} />
              </OrderGridPhone>
              </PhoneWrap>
            </React.Fragment>
          ))}
       
        <GrandAlign>
        <label></label>
        <label>TOTAL</label>
        <TotalStyle>${grandTotal}</TotalStyle>
        </GrandAlign>
      </React.Fragment>
  )

  return (
    <React.Fragment>
      {width > breakpoint ? innards1 : innards2 }
    </React.Fragment>
  );
};

export default BuildCurrentCartList;
