import React, { useEffect, useContext } from "react";

import swal from "@sweetalert/with-react";

import { Button } from "primereact/button";

import { ToggleContext } from "../../../../dataContexts/ToggleContext";
import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";

import styled from "styled-components";

const OrderGrid = styled.div`
  width: 100%;
  font-size: 1em;
  border-radius: 10px;
  padding: 20px;
  border: none;
  display: grid;
  grid-template-columns: 5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
  align-self: center;
  row-gap: 10px;
`;
const StandInput = styled.input`
  border: 1px solid gray;
  border-radius: 5px;
  width: 80%;
`;

const entryNotZero = {
  fontSize: "1.1em",
  fontWeight: "bold",
};

const entryZero = {
  fontSize: "1em",
  fontWeight: "normal",
};

const clonedeep = require("lodash.clonedeep");

const BuildCurrentStandingList = ({ database, setDatabase }) => {
  const [products, customers, routes, standing, orders] = database;
  const { setStandList, setModifications } = useContext(ToggleContext);
  const { chosen, standArray, setStandArray } = useContext(CurrentDataContext);

  useEffect(() => {
    let Stand = standing.filter((stand) => stand["custName"] === chosen);
    if (Stand.length > 0) {
      Stand = Stand[0]["isStand"];
    } else {
      Stand = true;
    }

    setStandList(Stand);
    let buildStandArray = standing.filter(
      (stand) => stand["isStand"] === Stand && stand["custName"] === chosen
    );

    setStandArray(buildStandArray);
    
  }, [chosen, standing]);

  const handleRemove = (index) => {
    let ind = standArray.findIndex((stand) => stand["prodName"] === index);
    let adjustedStanding = clonedeep(standArray);
    adjustedStanding[ind]["Sun"] = 0;
    adjustedStanding[ind]["Mon"] = 0;
    adjustedStanding[ind]["Tue"] = 0;
    adjustedStanding[ind]["Wed"] = 0;
    adjustedStanding[ind]["Thu"] = 0;
    adjustedStanding[ind]["Fri"] = 0;
    adjustedStanding[ind]["Sat"] = 0;
    setStandArray(adjustedStanding);
    setModifications(true)
    
  };

  const handleQtyModify = (e, qty) => {
    if (isNaN(e.target.value)) {
      e.target.value = null;
      swal({
        text: "Only Numbers Please",
        icon: "warning",
        buttons: false,
        timer: 2000,
      });
    }
    let day = e.target.dataset.day;
    let prod = e.target.name;
    let arrayToModify = clonedeep(standArray);
    let ind = arrayToModify.findIndex((array) => array["prodName"] === prod);
    arrayToModify[ind][day] = qty;

    setStandArray(arrayToModify);

   
  };

  return (
    <React.Fragment>
      <OrderGrid>
        <label>PRODUCT</label>
        <label>S</label>
        <label>M</label>
        <label>T</label>
        <label>W</label>
        <label>T</label>
        <label>F</label>
        <label>S</label>
        <label></label>
        {standArray
          ? standArray.map((order) => (
              <React.Fragment key={order["prodName"] + "frag"}>
                <label key={order["prodName"] + "prod"}>
                  {order["prodName"]}
                </label>

                <StandInput
                  type="text"
                  key={order["prodName"] + "Sun"}
                  size="3"
                  style={Number(order["Sun"]) > 0 ? entryNotZero : entryZero}
                  maxLength="3"
                  id={order["prodName"] + "_1"}
                  name={order["prodName"]}
                  placeholder={order["Sun"]}
                  data-day="Sun"
                  onKeyUp={(e) => {
                    handleQtyModify(e, Number(e.target.value));
                  }}
                  onBlur={(e) => {
                    e.target.value = null;
                  }}
                ></StandInput>
                <StandInput
                  type="text"
                  key={order["prodName"] + "Mon"}
                  size="3"
                  style={Number(order["Mon"]) > 0 ? entryNotZero : entryZero}
                  maxLength="3"
                  id={order["prodName"] + "_2"}
                  name={order["prodName"]}
                  placeholder={order["Mon"]}
                  data-day="Mon"
                  onKeyUp={(e) => {
                    handleQtyModify(e, Number(e.target.value));
                  }}
                  onBlur={(e) => {
                    e.target.value = "";
                  }}
                ></StandInput>
                <StandInput
                  type="text"
                  key={order["prodName"] + "Tue"}
                  size="3"
                  style={Number(order["Tue"]) > 0 ? entryNotZero : entryZero}
                  maxLength="3"
                  id={order["prodName"] + "_3"}
                  name={order["prodName"]}
                  placeholder={order["Tue"]}
                  data-day="Tue"
                  onKeyUp={(e) => {
                    handleQtyModify(e, Number(e.target.value));
                  }}
                  onBlur={(e) => {
                    e.target.value = "";
                  }}
                ></StandInput>
                <StandInput
                  type="text"
                  key={order["prodName"] + "Wed"}
                  size="3"
                  style={Number(order["Wed"]) > 0 ? entryNotZero : entryZero}
                  maxLength="3"
                  id={order["prodName"] + "_4"}
                  name={order["prodName"]}
                  placeholder={order["Wed"]}
                  data-day="Wed"
                  onKeyUp={(e) => {
                    handleQtyModify(e, Number(e.target.value));
                  }}
                  onBlur={(e) => {
                    e.target.value = "";
                  }}
                ></StandInput>
                <StandInput
                  type="text"
                  key={order["prodName"] + "Thu"}
                  size="3"
                  style={Number(order["Thu"]) > 0 ? entryNotZero : entryZero}
                  maxLength="3"
                  id={order["prodName"] + "_5"}
                  name={order["prodName"]}
                  placeholder={order["Thu"]}
                  data-day="Thu"
                  onKeyUp={(e) => {
                    handleQtyModify(e, Number(e.target.value));
                  }}
                  onBlur={(e) => {
                    e.target.value = "";
                  }}
                ></StandInput>
                <StandInput
                  type="text"
                  key={order["prodName"] + "Fri"}
                  size="3"
                  style={Number(order["Fri"]) > 0 ? entryNotZero : entryZero}
                  maxLength="3"
                  id={order["prodName"] + "_6"}
                  name={order["prodName"]}
                  placeholder={order["Fri"]}
                  data-day="Fri"
                  onKeyUp={(e) => {
                    handleQtyModify(e, Number(e.target.value));
                  }}
                  onBlur={(e) => {
                    e.target.value = "";
                  }}
                ></StandInput>
                <StandInput
                  type="text"
                  key={order["prodName"] + "Sat"}
                  size="3"
                  style={Number(order["Sat"]) > 0 ? entryNotZero : entryZero}
                  maxLength="3"
                  id={order["prodName"] + "_7"}
                  name={order["prodName"]}
                  placeholder={order["Sat"]}
                  data-day="Sat"
                  onKeyUp={(e) => {
                    handleQtyModify(e, Number(e.target.value));
                  }}
                  onBlur={(e) => {
                    e.target.value = "";
                  }}
                ></StandInput>

                <Button
                  icon="pi pi-trash"
                  className="p-button-outlined p-button-rounded p-button-help p-button-sm"
                  key={order["prodName"] + "rem"}
                  name={order["prodName"]}
                  onClick={(e) => handleRemove(order["prodName"])}
                ></Button>
              </React.Fragment>
            ))
          : ""}
      </OrderGrid>
    </React.Fragment>
  );
};

export default BuildCurrentStandingList;
