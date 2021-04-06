import React from "react";

import styled from "styled-components";

import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";

import { setDropDownValue, setYesNoValue } from "../../../helpers/formHelpers";

const terms = [{ terms: "0" }, { terms: "15" }, { terms: "30" }];



const options = [
  {label: 'Yes', value: true},
  {label: 'No', value: false},
  
];

const invoicing = [
  { invoicing: "daily" },
  { invoicing: "weekly" },
];

const YesNoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
`;

const Billing = ({ selectedCustomer, setSelectedCustomer }) => {
  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-money-bill"></i> Billing
      </h2>

      <YesNoBox>
        <label htmlFor="paperInvoice">Paper Invoice</label>
        <SelectButton
          value={selectedCustomer.toBePrinted}
          id="toBePrinted"
          options={options}
          onChange={(e) =>
            setSelectedCustomer(setYesNoValue(e, selectedCustomer))
          }
        />
      </YesNoBox>

      <YesNoBox>
        <label htmlFor="emailInvoice">Email Invoice</label>
        <SelectButton
          value={selectedCustomer.toBeEmailed}
          id="toBeEmailed"
          options={options}
          onChange={(e) =>
            setSelectedCustomer(setYesNoValue(e, selectedCustomer))
          }
        />
      </YesNoBox>

      <YesNoBox>
        <label htmlFor="printDuplicate">Print Duplicate</label>
        <SelectButton
          value={selectedCustomer.printDuplicate}
          id="printDuplicate"
          options={options}
          onChange={(e) =>
            setSelectedCustomer(setYesNoValue(e, selectedCustomer))
          }
        />
      </YesNoBox>

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="terms">Terms</label>
        </span>
        <Dropdown
          id="terms"
          optionLabel="terms"
          options={terms}
          onChange={(e) =>
            setSelectedCustomer(setDropDownValue(e, selectedCustomer))
          }
          placeholder={
            selectedCustomer ? selectedCustomer.terms : "Select Terms"
          }
        />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="invoicing">Invoicing</label>
        </span>
        <Dropdown
          id="invoicing"
          optionLabel="invoicing"
          options={invoicing}
          onChange={(e) =>
            setSelectedCustomer(setDropDownValue(e, selectedCustomer))
          }
          placeholder={
            selectedCustomer
              ? selectedCustomer.invoicing
              : "Invoicing Preference"
          }
        />
      </div>
      <br />
    </React.Fragment>
  );
};

export default Billing;
