import React, { useState, useContext, useEffect, useRef } from "react";
import { API } from "aws-amplify";

import { ToggleContext } from "../dataContexts/ToggleContext";

import { listProducts, listProduct2s } from "../helpers/customQueries";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const dbSelectItems = [
  { label: "Product", value: "Product" },
  { label: "Customer", value: "Customer" },
  { label: "Order", value: "Order" },
  { label: "Standing", value: "Standing" },
];

const fetchDB = async (func,funcname) => {
  
  let products;
  try {
    products = await API.graphql({
      query: func,
      variables: {
        limit: 500,
      },
    });
  } catch (err) {
    console.log(err);
  }

  return products.data[funcname].items;
};

function Remap() {
  const toast = useRef(null);
  const [db, setDb] = useState("Product");

  const showUpdate = (message) => {
    toast.current.show({
      severity: "success",
      summary: message,
      detail: message,
      life: 3000,
    });
  };

  let { isLoading, setIsLoading } = useContext(ToggleContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleClick = async () => {
    // Grab sending database (i.e. - Product)
    showUpdate("Grabbing origin database " + db);
    let products = await fetchDB(listProducts,"listProducts");

    // Grab receiving database (i.e. - Product2)
    showUpdate("Grabbing receiving database " + db + "2");
    let product2s = await fetchDB(listProduct2s,"listProduct2s");

    console.log(products);
    console.log(product2s);
  };

  return (
    <React.Fragment>
      <Toast ref={toast} />
      <Dropdown
        value={db}
        options={dbSelectItems}
        onChange={(e) => setDb(e.value)}
        placeholder="Select a Database"
      />
      <Button label={"Map " + db} onClick={handleClick} />
    </React.Fragment>
  );
}

export default Remap;
