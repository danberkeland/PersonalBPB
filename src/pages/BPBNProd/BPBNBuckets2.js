import React, { useContext, useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import TimeAgo from "timeago-react"; // var TimeAgo = require('timeago-react');
import us from "timeago.js/lib/lang/en_US";

import swal from "@sweetalert/with-react";

import { CustomerContext } from "../../dataContexts/CustomerContext";
import {
  ProductsContext,
  ProductsLoad,
} from "../../dataContexts/ProductsContext";
import { OrdersContext } from "../../dataContexts/OrdersContext";
import { StandingContext } from "../../dataContexts/StandingContext";
import { HoldingContext } from "../../dataContexts/HoldingContext";
import { ToggleContext } from "../../dataContexts/ToggleContext";

import { updateProduct } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import styled from "styled-components";

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;

  padding: 5px 10px;
  margin: 4px auto;
  box-sizing: border-box;
`;

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const IngDetails = styled.div`
  font-size: 0.8em;
`;

const clonedeep = require("lodash.clonedeep");

const { DateTime } = require("luxon");

function BPBNBuckets() {
  const { products, setProducts, prodLoaded, setProdLoaded } =
    useContext(ProductsContext);
  const { setCustLoaded } = useContext(CustomerContext);
  let { setHoldLoaded } = useContext(HoldingContext);
  let { setOrdersLoaded } = useContext(OrdersContext);
  let { setStandLoaded } = useContext(StandingContext);

  const [signedIn, setSignedIn] = useState("null");
  const [eodProds, setEODProds] = useState();
  const [shelfBag, setShelfBag] = useState(false);
  const [shelfEa, setShelfEa] = useState(false);
  const [freezerBag, setFreezerBag] = useState(false);
  const [freezerEa, setFreezerEa] = useState(false);

  
  useEffect(() => {
    let prodsToMap = products.filter(
      (prod) => prod.bakedWhere[0] === loc && prod.eodCount === true
    );
    setEODProds(prodsToMap);
  }, [products]);

  useEffect(() => {
    if (eodProds) {
      if (
        eodProds.filter(
          (prods) => prods.freezerThaw !== true && Number(prods.packSize) > 1
        ).length > 0
      ) {
        setShelfBag(true);
      }
      if (
        eodProds.filter(
          (prods) => prods.freezerThaw !== true && Number(prods.packSize) === 1
        ).length > 0
      ) {
        setShelfEa(true);
      }
      if (
        eodProds.filter(
          (prods) => prods.freezerThaw !== false && Number(prods.packSize) > 1
        ).length > 0
      ) {
        setFreezerBag(true);
      }
      if (
        eodProds.filter(
          (prods) => prods.freezerThaw !== false && Number(prods.packSize) === 1
        ).length > 0
      ) {
        setFreezerEa(true);
      }
    }
  }, [eodProds]);

  const updateDBattr = async (id, attr, val) => {
    let addDetails = {
      id: id,
      [attr]: val,
      whoCountedLast: signedIn,
    };
    try {
      await API.graphql(
        graphqlOperation(updateProduct, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on updating product", error);
    }
  };

  const updateItem = (value, itemToUpdate) => {
    let ind = itemToUpdate.findIndex((item) => item.id === value.target.id);

    itemToUpdate[ind].currentStock = value.target.value;
    itemToUpdate[ind].updatedAt = DateTime.now().setZone("America/Los_Angeles");
    itemToUpdate[ind].whoCountedLast = signedIn;

    try {
      let id = value.target.id;
      let val = Number(value.target.value);
      updateDBattr(id, "currentStock", val);
    } catch {
      console.log("error updating attribute.");
    }
  };

  const handleChange = (value) => {
    if (value.code === "Enter") {
      let itemToUpdate = clonedeep(products);
      updateItem(value, itemToUpdate);
      document.getElementById(value.target.id).value = "";

      return itemToUpdate;
    }
  };

  const handleBlur = (value) => {
    let itemToUpdate = clonedeep(products);
    if (value.target.value !== "") {
      updateItem(value, itemToUpdate);
    }
    document.getElementById(value.target.id).value = "";

    return itemToUpdate;
  };

  const handleInput = (e) => {
    return (
      <InputText
        id={e.id}
        style={{
          width: "50px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
        }}
        placeholder={e.currentStock}
        onKeyUp={(e) => e.code === "Enter" && setProducts(handleChange(e))}
        onBlur={(e) => setProducts(handleBlur(e))}
      />
    );
  };


  return (
    <React.Fragment>
      <WholeBox>
        <h2>In Freezer</h2>

        <DataTable
          value={eodProds.filter(
            (prods) => prods.freezerThaw !== false && Number(prods.packSize) > 1
          )}
          className="p-datatable-sm"
        >
          <Column field="prodName" header="In Freezer"></Column>

          <Column
            className="p-text-center"
            header="# of bags"
            body={(e) => handleInput(e)}
          ></Column>
          <Column className="p-text-center" header="ea" body={eaCount}></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNBuckets;
