import React from "react";

import BuildCurrentCartList from "./BuildCurrentCartList";

const CartEntryItem = ({ database, setDatabase }) => {
  return (
    <React.Fragment>
      <BuildCurrentCartList database={database} setDatabase={setDatabase}/>
    </React.Fragment>
  );
};

export default CartEntryItem;
