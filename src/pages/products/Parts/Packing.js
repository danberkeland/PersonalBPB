import React from "react";

import styled from "styled-components";

import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";

import {
  setValue,
  fixValue,
  setYesNoValue,
  setDropDownValue,
} from "../../../helpers/formHelpers";

const options = [{label:"Yes", value:true},
{label:"No", value:false}];

const groups = [
  { packGroup: "baked pastries" },
  { packGroup: "frozen pastries" },
  { packGroup: "rustic breads" },
];

const YesNoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
`;

const Packing = ({ selectedProduct, setSelectedProduct }) => {
  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-user"></i> Packing Info
      </h2>
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="packGroup">Pack Group</label>
        </span>
        <Dropdown
          id="packGroup"
          optionLabel="packGroup"
          options={groups}
          onChange={(e) =>
            setSelectedProduct(setDropDownValue(e, selectedProduct))
          }
          placeholder={
            selectedProduct ? selectedProduct.packGroup : "Select Pack Group"
          }
        />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="nickName">Pack Size</label>
          <br />
        </span>

        <InputText
          id="packSize"
          placeholder={selectedProduct.packSize}
          onKeyUp={(e) =>
            e.code === "Enter" &&
            setSelectedProduct(setValue(e, selectedProduct))
          }
          onBlur={(e) => setSelectedProduct(fixValue(e, selectedProduct))}
        />
      </div>
      <br />
      <YesNoBox>
        <label htmlFor="freezerThaw">Thaw before delivery?</label>
        <SelectButton
          value={selectedProduct.freezerThaw}
          id="freezerThaw"
          options={options}
          onChange={(e) =>
            setSelectedProduct(setYesNoValue(e, selectedProduct))
          }
        />
      </YesNoBox>
    </React.Fragment>
  );
};

export default Packing;
