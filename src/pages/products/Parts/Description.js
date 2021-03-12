import React from "react";

import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";

import { setValue, fixValue } from "../../../helpers/formHelpers";

const Description = ({ selectedProduct, setSelectedProduct }) => {
  return (
    <React.Fragment>
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="picURL"> Picture URL</label>
          <br />
        </span>

        <InputText
          id="picURL"
          placeholder={selectedProduct.picURL}
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
          <label htmlFor="nickName"> Square ID</label>
          <br />
        </span>

        <InputText
          id="squareID"
          placeholder={selectedProduct.squareID}
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
        <InputTextarea
          rows={3}
          cols={30}
          id="descrip"
          placeholder={selectedProduct.descrip}
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

export default Description;
