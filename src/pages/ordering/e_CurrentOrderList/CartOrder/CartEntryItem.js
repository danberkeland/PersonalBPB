import React from "react";

import BuildCurrentCartList from "./BuildCurrentCartList";

const CartEntryItem = ({ database }) => {
  return (
    <React.Fragment>
      <BuildCurrentCartList database={database}/>
    </React.Fragment>
  );
};

export default CartEntryItem;
