import React from "react";

import styled from "styled-components";

import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";

import {
  setValue,
  fixValue,
  setYesNoValue,
} from "../../../helpers/formHelpers";

const options = [{label:"Yes", value:true},
{label:"No", value:false}];

const YesNoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
`;

const Billing = ({ selectedProduct, setSelectedProduct }) => {
  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-user"></i> Billing
      </h2>
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="picURL">Wholesale Price $</label>
          <br />
        </span>

        <InputText
          id="wholePrice"
          placeholder={selectedProduct.wholePrice}
          
          onKeyUp={(e) =>
            e.code === "Enter" &&
            setSelectedProduct(setValue(e, selectedProduct))
          }
          onBlur={(e) => setSelectedProduct(fixValue(e, selectedProduct))}
        />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="nickName">Retail Price $</label>
          <br />
        </span>

        <InputText
          id="retailPrice"
          placeholder={selectedProduct.retailPrice}
          
          onKeyUp={(e) =>
            e.code === "Enter" &&
            setSelectedProduct(setValue(e, selectedProduct))
          }
          onBlur={(e) => setSelectedProduct(fixValue(e, selectedProduct))}
        />
      </div>
      <br />
      <YesNoBox>
        <label htmlFor="isWhole">Is Product Available Wholesale?</label>
        <SelectButton
          value={selectedProduct.isWhole}
          id="isWhole"
          options={options}
          onChange={(e) =>
            setSelectedProduct(setYesNoValue(e, selectedProduct))
          }
        />
      </YesNoBox>
    </React.Fragment>
  );
};

export default Billing;
