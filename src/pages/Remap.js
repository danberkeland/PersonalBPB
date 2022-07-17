import React, { useState, useContext, useEffect, useRef } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { ToggleContext } from "../dataContexts/ToggleContext";

import {
  listProducts,
  listProduct2s 
} from "../helpers/customQueries";

import {
  updateProduct2,
  createProduct2,
  deleteProduct2
} from "../graphql/mutations"

import {
  listCustomers,
  listCustomer2s
} from "../helpers/customQueries";

import {
  updateCustomer2,
  createCustomer2,
  deleteCustomer2
} from "../graphql/mutations"



import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const fetchDB = async (func, funcname) => {
  let data;
  try {
    data = await API.graphql({
      query: func,
      variables: {
        limit: 500,
      },
    });
  } catch (err) {
    console.log(err);
  }

  return data.data[funcname].items;
};

const createItem = async (item, func) => {
  try {
    await API.graphql(graphqlOperation(func, { input: { ...item } }));
  } catch (err) {
    console.log(err);
  }
};

const deleteItem = async (item, func) => {
  console.log("deleteItem", item);
  try {
    await API.graphql(graphqlOperation(func, { input: item }));
  } catch (err) {
    console.log(err);
  }
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

  const handleMapProducts = async () => {
    // Grab sending database (i.e. - Product)
    showUpdate("Grabbing origin database " + db);
    let products = await fetchDB(listProducts, "listProducts");

    // Grab receiving database (i.e. - Product2)
    showUpdate("Grabbing receiving database " + db + "2");
    let product2s = await fetchDB(listProduct2s, "listProduct2s");

    // for item in Product2, if not in Product, delete from Product2
    let prodNicksOld = products.map((prod) => prod.nickName);

    for (let item of product2s) {
      if (prodNicksOld.includes(item.prodNick)) {
      } else {
        let toDel = {
          prodNick: item.prodNick,
        };
        showUpdate(item.prodNick + " will be deleted");
        await deleteItem(toDel, deleteProduct2);
      }
    }

    // for item in Product, if in Product2, update - else add
    let prodNicksNew = product2s.map((prod) => prod.prodNick);

    for (let item of products) {
      let addDetails = {
        prodNick: item.nickName,
        prodName: item.prodName,
      };
      if (prodNicksNew.includes(item.nickName)) {
        showUpdate(item.nickName + " will be updated");
        await createItem(addDetails, updateProduct2);
      } else {
        showUpdate(item.nickName + " will be added");
        await createItem(addDetails, createProduct2);
      }
    }
  };

  const handleMapCustomers = async () => {
    // Grab sending database (i.e. - Customer)
    showUpdate("Grabbing origin database " + db);
    let customers = await fetchDB(listCustomers, "listCustomers");

    // Grab receiving database (i.e. - Customer2)
    showUpdate("Grabbing receiving database " + db + "2");
    let customer2s = await fetchDB(listCustomer2s, "listCustomer2s");

    // for item in Customer2, if not in Customer, delete from Customer2
    let custNicksOld = customers.map((cust) => cust.nickName);

    for (let cust of customer2s) {
      if (custNicksOld.includes(cust.custNick)) {
      } else {
        let toDel = {
          custNick: cust.custNick,
        };
        showUpdate(cust.custNick + " will be deleted");
        await deleteItem(toDel, deleteCustomer2);
      }
    }

    // for item in Product, if in Product2, update - else add
    let custNicksNew = customer2s.map((cust) => cust.custNick);

    for (let cust of customers) {
      let addDetails = {
        custNick: cust.nickName,
        custName: cust.custName,
      };
      if (custNicksNew.includes(cust.nickName)) {
        showUpdate(cust.nickName + " will be updated");
        await createItem(addDetails, updateCustomer2);
      } else {
        showUpdate(cust.nickName + " will be added");
        await createItem(addDetails, createCustomer2);
      }
    }
  };

  const handleMapOrders = async () => {};

  const handleMapStanding = async () => {};

  return (
    <React.Fragment>
      <Toast ref={toast} />

      <Button label="Map Products" onClick={handleMapProducts} />
      <Button label="Map Customers" onClick={handleMapCustomers} />
      <Button label="Map Orders" onClick={handleMapOrders} />
      <Button label="Map Standing" onClick={handleMapStanding} />
    </React.Fragment>
  );
}

export default Remap;
