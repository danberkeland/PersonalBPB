import React from "react";

import { InputText } from "primereact/inputtext";

import { setValue, fixValue } from "../../../helpers/formHelpers";

const Name = ({ selectedProduct, setSelectedProduct }) => {
  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-user"></i> Product Description
      </h2>

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="ProdName"> Product Name</label>
          <br />
        </span>

        <InputText
          id="prodName"
          placeholder={selectedProduct.prodName}
          disabled
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
          <label htmlFor="nickName"> Nickname</label>
          <br />
        </span>

        <InputText
          id="nickName"
          placeholder={selectedProduct.nickName}
          disabled
          onKeyUp={(e) =>
            e.code === "Enter" &&
            setSelectedProduct(setValue(e, selectedProduct))
          }
          onBlur={(e) => setSelectedProduct(fixValue(e, selectedProduct))}
        />
      </div>
      <br />
    </React.Fragment>
  );
};

export default Name;
