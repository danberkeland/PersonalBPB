import React, { useState, useContext, useEffect, useRef } from "react";
import { API, graphqlOperation } from "aws-amplify";



import { ToggleContext } from "../dataContexts/ToggleContext";

import { listProducts, listProduct2s, updateProduct2, createProduct2, deleteProduct2 } from "../helpers/customQueries";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";


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


const createItem = async (item, func) => { 
  try {
    await API.graphql(
      graphqlOperation(func, { input: { ...item } })
    );
  } catch (err) {
    console.log(err);
  }

};

const deleteItem = async (item, func) => { 
  console.log("deleteItem",item)
  try {
    await API.graphql(
      graphqlOperation(func, { input: item })
    );
   
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

  const handleClick = async () => {
    // Grab sending database (i.e. - Product)
    showUpdate("Grabbing origin database " + db);
    let products = await fetchDB(listProducts,"listProducts");

    // Grab receiving database (i.e. - Product2)
    showUpdate("Grabbing receiving database " + db + "2");
    let product2s = await fetchDB(listProduct2s,"listProduct2s");

    // for item in Product2, if not in Product, delete from Product2
    let prodNicksOld = products.map(prod => prod.nickName)
   
    for (let item of product2s){
      if (prodNicksOld.includes(item.prodNick)){
        //showUpdate(item.prodNick + " already exists");
      } else {
        let toDel = {
          prodNick: item.prodNick
        }
        showUpdate(item.prodNick + " will be deleted");
        await deleteItem(toDel, deleteProduct2)
      }
    }

    // for item in Product, if in Product2, update - else add
    let prodNicksNew = product2s.map(prod => prod.prodNick)
    
    for (let item of products){
      let addDetails = {
        prodNick: item.nickName,
        prodName: item.prodName
      }
      if (prodNicksNew.includes(item.nickName)){
        showUpdate(item.nickName + " will be updated");
        await createItem(addDetails, updateProduct2)
      } else {
        showUpdate(item.nickName + " will be added");
        await createItem(addDetails, createProduct2)
      }
    }

  }

  return (
    <React.Fragment>
      <Toast ref={toast} />
      
      <Button label="Map Products" onClick={handleClick} />
    </React.Fragment>
  );
}

export default Remap;
