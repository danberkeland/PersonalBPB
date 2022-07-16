import React, { useState, useContext, useEffect, useRef } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { ToggleContext } from "../dataContexts/ToggleContext";

import * as queries from "../graphql/queries";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const dbSelectItems = [
  { label: "Product", value: "Product" },
  { label: "Customer", value: "Customer" },
  { label: "Order", value: "Order" },
  { label: "Standing", value: "Standing" },
];

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
    await setTimeout(() => {
      console.log("Timeout");
    }, 1500);

    let products;

    try {
      products = await API.graphql({
        query: queries.listProducts,
        variables: {
          limit: 500,
        },
      });
    } catch (err) {
      console.log(err);
    }

    console.log(products.data.listProducts.items);

    // Grab receiving database (i.e. - Product2)
    showUpdate("Grabbing receiving database " + db + "2");
    await setTimeout(() => {
      console.log("Timeout");
    }, 1500);

    let product2s;

    try {
      product2s = await API.graphql({
        query: queries.listProduct2s,
        variables: {
          limit: 500,
        },
      });
    } catch (err) {
      console.log(err);
    }

    console.log(product2s.data.listProduct2s.items);
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
