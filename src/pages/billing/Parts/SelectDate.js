import React, { useContext, useEffect } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";

import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";

import styled from "styled-components";

import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../helpers/dateTimeHelpers";

const { DateTime } = require("luxon");

const BasicContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  
  box-sizing: border-box;
`;

const SelectDate = ({ nextInv, setNextInv }) => {
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);

  
 

  useEffect(() => {
    let [today] = todayPlus();
    setDelivDate(today);
  }, []);

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
  };

 
  return (
    <React.Fragment>
      <BasicContainer>
      <div className="p-field p-col-12 p-md-4">
        <label htmlFor="delivDate">Pick Delivery Date: </label>
        <Calendar
          id="delivDate"
          placeholder={convertDatetoBPBDate(delivDate)}
          disabled
          dateFormat="mm/dd/yy"
          onChange={(e) => setDate(e.value)}
        />
        </div>
        <div>
        <span className="p-float-label">
            <InputText
              id="invNum"
              size="50"
              placeholder={nextInv}
              onKeyUp={(e) =>
                e.code === "Enter" &&
                setNextInv(e.target.value)
              }
              onBlur={(e) => setNextInv(e.target.value)}
            />
            <label htmlFor="invNum">
              Enter next available invoice #
            </label>
          </span>
      </div>
      </BasicContainer>
    </React.Fragment>
  );
};

export default SelectDate;

