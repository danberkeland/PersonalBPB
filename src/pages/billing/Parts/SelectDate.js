import React, { useContext, useEffect, useState } from "react";

import { CurrentDataContext } from "../../../dataContexts/CurrentDataContext";
import { CustomerContext } from "../../../dataContexts/CustomerContext";

import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import styled from "styled-components";

import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../../helpers/dateTimeHelpers";

const clonedeep = require("lodash.clonedeep");


const { DateTime } = require("luxon");

const BasicContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  
  box-sizing: border-box;
`;

const SelectDate = ({ nextInv, setNextInv, dailyInvoices, setDailyInvoices }) => {
  const { delivDate, setDelivDate } = useContext(CurrentDataContext);
  const { customers } = useContext(CustomerContext)

  const [ pickedCustomer, setPickedCustomer ] = useState();

  
 

  useEffect(() => {
    let [today] = todayPlus();
    setDelivDate(today);
  }, []);

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
  };

  const handleAddCustomer = (e) => {
    let invToModify = clonedeep(dailyInvoices);
    invToModify.push({
      custName: e.target.value,
      invNum: dailyInvoices[dailyInvoices.length - 1]["invNum"] + 1,
      orders: [],
    });
    setDailyInvoices(invToModify);
    setPickedCustomer('')
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
          <Button value={pickedCustomer} onClick={e => handleAddCustomer(e)}>ADD CUSTOMER +</Button>
          
          <Dropdown
            optionLabel="custName"
            options={customers}
            placeholder={pickedCustomer}
            name="customers"
            value={pickedCustomer}
            onChange={e => setPickedCustomer(e.target.value.custName)}
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

