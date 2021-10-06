import React from "react";

import BuildCurrentCartList from "./BuildCurrentCartList";

const CartEntryItem = ({ database, setDatabase, authType }) => {
  return (
    <React.Fragment>
      <BuildCurrentCartList database={database} setDatabase={setDatabase} authType={authType}/>
    </React.Fragment>
  );
};

export default CartEntryItem;
