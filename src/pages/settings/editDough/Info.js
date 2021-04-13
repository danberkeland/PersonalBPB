import React, { useContext } from "react";
import { useEffect } from "react/cjs/react.development";

import styled from "styled-components";

import { ToggleContext } from "../../../dataContexts/ToggleContext";

const clonedeep = require("lodash.clonedeep");

const DuoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 20px 0;
`;

const WeekWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  margin: 0 0 30px 0;
`;

const Info = ({
  selectedDough,
  setSelectedDough,
  doughs,
  setDoughs,
  doughComponents,
  setDoughComponents,
}) => {
  let { setIsLoading } = useContext(ToggleContext);

  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-map"></i> Dough Info
      </h2>
      <h2>
        <i className="pi pi-map"></i> PreFerments
      </h2>
      {doughComponents
        ? doughComponents
            .filter(
              (dgh) =>
                dgh.dough === selectedDough.doughName &&
                dgh.componentType === "pre"
            )
            .map((dgh) => <div>{dgh.componentName} {dgh.amount}</div>)
        : ""}
      <h2>
        <i className="pi pi-map"></i> Bulk Mix
      </h2>
      {doughComponents
        ? doughComponents
            .filter(
              (dgh) =>
                dgh.dough === selectedDough.doughName &&
                dgh.componentType === "dry"
            )
            .map((dgh) => <div>{dgh.componentName} {dgh.amount}</div>)
        : ""}
        {doughComponents
        ? doughComponents
            .filter(
              (dgh) =>
                dgh.dough === selectedDough.doughName &&
                dgh.componentType === "dryplus"
            )
            .map((dgh) => <div>{dgh.componentName} {dgh.amount}</div>)
        : ""}
        {doughComponents
        ? doughComponents
            .filter(
              (dgh) =>
                dgh.dough === selectedDough.doughName &&
                dgh.componentType === "wet"
            )
            .map((dgh) => <div>{dgh.componentName} {dgh.amount}</div>)
        : ""}
        {doughComponents
        ? doughComponents
            .filter(
              (dgh) =>
                dgh.dough === selectedDough.doughName &&
                dgh.componentType === "wetplus"
            )
            .map((dgh) => <div>{dgh.componentName} {dgh.amount}</div>)
        : ""}
      <h2>
        <i className="pi pi-map"></i> Post Mix Additions
      </h2>
      {doughComponents
        ? doughComponents
            .filter(
              (dgh) =>
                dgh.dough === selectedDough.doughName &&
                dgh.componentType === "post"
            )
            .map((dgh) => <div>{dgh.componentName} {dgh.amount}</div>)
        : ""}
    </React.Fragment>
  );
};

export default Info;
