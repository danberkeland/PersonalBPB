import React, { useContext } from "react";

import { CurrentDataContext } from "../../../../../dataContexts/CurrentDataContext";

import { InputText } from "primereact/inputtext";

const Quantity = () => {
  
  const { chosen } = useContext(CurrentDataContext);


  const innards1 = (
    <React.Fragment>
      <InputText
          id="addedProdQty"
          size="10"
          disabled={chosen !== "  " ? false : true}
        />
        <label htmlFor="qty">Quantity</label>
    </React.Fragment>
    
  )
  
  return (
    
      <span className="p-float-label">
        {innards1}
      </span>
     
  );
};

export default Quantity;
