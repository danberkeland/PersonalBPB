import React, { useContext } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";

import { InputText } from "primereact/inputtext";

const Quantity = () => {
  
  const { chosen } = useContext(CurrentDataContext);
  
  return (
    
      <span className="p-float-label">
        <InputText
          id="addedProdQty"
          size="10"
          disabled={chosen !== "  " ? false : true}
        />
        <label htmlFor="qty">Quantity</label>
      </span>
     
  );
};

export default Quantity;
