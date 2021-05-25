import React, { useContext, useEffect, useState } from "react";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { ToggleContext } from "../../../../dataContexts/ToggleContext";

import styled from "styled-components";

const TitleFrame = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.h2`
  padding: 0;
  margin: 10px 0;
`;
const DateStyle = styled.h4`
  padding: 0;
  color: grey;
  margin: 10px 0;
`;

const ho = {
  color: "red",
};

const so = {
  color: "rgb(66, 97, 201)",
};

const TitleBox = () => {
  const {
    cartList,
    standList,
    orderTypeWhole,
  } = useContext(ToggleContext);

  const [orderType, setOrderType] = useState();

  const { delivDate } = useContext(CurrentDataContext);

  useEffect(() => {
    if (cartList) {
      setOrderType("Cart");
    } else {
      if (standList) {
        setOrderType("Stand");
      } else {
        setOrderType("Hold");
      }
    }
  }, [cartList, standList]);

  const changeDate = (date) => {
    let fd = new Date(date);
    fd.setMinutes(fd.getMinutes() + fd.getTimezoneOffset());
    let returnDate = fd.toDateString();

    return returnDate;
  };

  return (
    <React.Fragment>
      {orderTypeWhole ? (
        <React.Fragment>
          <TitleFrame>
            <Title style={cartList ? so : standList ? so : ho}>
              Wholesale {orderType} Order
            </Title>
            <DateStyle>{delivDate ? changeDate(delivDate) : ""}</DateStyle>
          </TitleFrame>
        </React.Fragment>
      ) : (
        <h2 style={standList ? so : ho}>Retail {orderType} Order</h2>
      )}
    </React.Fragment>
  );
};

export default TitleBox;
