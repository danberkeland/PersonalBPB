import React, { useContext, useEffect, useState } from "react";

import { CustomerContext } from "../../dataContexts/CustomerContext";
import { ProductsContext, ProductsLoad } from "../../dataContexts/ProductsContext";
import { OrdersContext } from "../../dataContexts/OrdersContext";
import { StandingContext } from "../../dataContexts/StandingContext";
import { HoldingContext } from "../../dataContexts/HoldingContext";

function BPBSCounts() {
  const { products, prodLoaded, setProdLoaded } = useContext(ProductsContext);
  const { setCustLoaded } = useContext(CustomerContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  const [ eodProds, setEODProds ] = useState()

  useEffect(() => {
    if (!products) {
      setProdLoaded(false);
    }
    setCustLoaded(true);
    setHoldLoaded(true);
    setOrdersLoaded(true);
    setStandLoaded(true);
  }, []);

  useEffect(() => {
    let prodsToMap = products.filter(prod => prod.bakedWhere[0] === "Prado" && prod.eodCount===true)
    setEODProds(prodsToMap)
  },[products])
  

  return (
    <React.Fragment>
      {!prodLoaded ? <ProductsLoad /> : ""}
      <h1>BPBS EOD Counts</h1>
      {eodProds ? eodProds.map(eod => (
        <div key={eod.prodName}>{eod.prodName}</div>
      )) : ''}
      
      
    </React.Fragment>
  );
}

export default BPBSCounts;
