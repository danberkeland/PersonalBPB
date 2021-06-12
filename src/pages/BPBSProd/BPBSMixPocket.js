import React, { useState, useEffect, useContext } from "react";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { promisedData } from "../../helpers/databaseFetchers";
import ComposeDough from "../BPBNProd/Utils/composeDough";
import { todayPlus } from "../../helpers/dateTimeHelpers";

import { updateDough } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import jsPDF from "jspdf";
import "jspdf-autotable";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;
  padding: 5px;
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;
  padding: 5px;
`;

const addUp = (acc, val) => {
  return acc + val;
};

const clonedeep = require("lodash.clonedeep");
const compose = new ComposeDough();

function BPBSMixPocket() {
  const { setIsLoading } = useContext(ToggleContext);

  const [ pockets, setPockets ] = useState([])
  const [doughs, setDoughs] = useState([]);
  const [doughComponents, setDoughComponents] = useState([]);

  let twoDay = todayPlus()[2];

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherDoughInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherDoughInfo = (database) => {
    let doughData = compose.returnDoughBreakDown(twoDay, database, "Prado");
    setDoughs(doughData.doughs);
    setDoughComponents(doughData.doughComponents);
    setPockets(doughData.pockets)
  };

  const handleChange = (e) => {
    if (e.code === "Enter") {
      updateDoughDB(e);
    }
  };

  const handleBlur = (e) => {
    updateDoughDB(e);
  };

  const updateDoughDB = async (e) => {
    let id = e.target.id.split("_")[0];
    let attr = e.target.id.split("_")[1];
    let qty = e.target.value;

    let doughsToMod = clonedeep(doughs);
    doughsToMod[doughsToMod.findIndex((dgh) => dgh.id === id)][attr] = qty;
    setDoughs(doughsToMod);

    let updateDetails = {
      id: id,
      [attr]: qty,
    };

    try {
      await API.graphql(
        graphqlOperation(updateDough, { input: { ...updateDetails } })
      );
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  const handleClick = (e, amt) => {
    console.log(amt);
    let mixNumber = Math.ceil(amt/230)
    amt = amt/mixNumber
    let doughName = e.target.id.split("_")[0];
    let components = doughComponents.filter((dgh) => dgh.dough === doughName);
    let wetWeight = Number(
      doughs[doughs.findIndex((dgh) => dgh.doughName === doughName)].hydration
    );
    let wetList = components
      .filter((dgh) => dgh.componentType === "wet")
      .map((it) => it.amount);
    let wetTotals;
    wetList.length > 0 ? (wetTotals = wetList.reduce(addUp)) : (wetTotals = 0);
    let dryList = components
      .filter((dgh) => dgh.componentType === "dry")
      .map((it) => it.amount);
    let dryTotals;
    dryList.length > 0 ? (dryTotals = dryList.reduce(addUp)) : (dryTotals = 0);
    let levList = components
      .filter((dgh) => dgh.componentType === "lev")
      .map((it) => it.amount);
    let levTotals;
    levList.length > 0 ? (levTotals = levList.reduce(addUp)) : (levTotals = 0);
    let dryplusList = components
      .filter((dgh) => dgh.componentType === "dryplus")
      .map((it) => it.amount);
    let dryplusTotals;
    dryplusList.length > 0
      ? (dryplusTotals = dryplusList.reduce(addUp))
      : (dryplusTotals = 0);
    let postList = components
      .filter((dgh) => dgh.componentType === "post")
      .map((it) => it.amount);
    let postTotals;
    postList.length > 0
      ? (postTotals = postList.reduce(addUp))
      : (postTotals = 0);
    let dryWeight =
      (100 / (100 + wetWeight + levTotals + dryplusTotals + postTotals)) * amt;

    
    
    const doc = new jsPDF({
      orientation: "l",
      unit: "in",
      format: [2, 4],
    });

    let ct = 0.7;
    let dryFilt = components.filter((dgh) => dgh.componentType === "dry");
    if (dryFilt.length > 0) {
      doc.setFontSize(14);
      doc.text(`${doughName} - Dry`, 0.2, 0.36);
      doc.setFontSize(10)
      doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)

      doc.setFontSize(12);
      for (let item of dryFilt) {

        if (((item.amount / dryTotals) * dryWeight)>50){
          let itemAmount = ((item.amount / dryTotals) * dryWeight)
          let bags = Math.floor(itemAmount/50)
          item.amount = dryTotals * ((dryWeight-(50 * bags))/dryWeight)
          doc.text(`50 lb. bag ${item.componentName}`, 1.2, ct);
        doc.text(
          `${bags}`,
          0.3,
          ct
        );
        
        ct += 0.24;
        }
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(
          `${((item.amount / dryTotals) * dryWeight).toFixed(2)}`,
          0.3,
          ct
        );
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }

    let dryplusFilt = components.filter(
      (dgh) =>
        dgh.componentType === "dryplus" &&
        dgh.componentName !== "Salt" &&
        dgh.componentName !== "Yeast"
    );
    if (dryplusFilt.length > 0) {
      for (let item of dryplusFilt) {
        
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(`${(item.amount * dryWeight * 0.01).toFixed(2)}`, 0.3, ct);
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }

    let wetFilt = components.filter((dgh) => dgh.componentType === "wet");
    if (wetFilt.length > 0) {
      doc.addPage({
        format: [2, 4],
        orientation: "l",
      });
      doc.setFontSize(14);
      doc.text(`${doughName} - Wet`, 0.2, 0.36);
      doc.setFontSize(10)
      doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)

      doc.setFontSize(12);
      let ct = 0.7;
      for (let item of wetFilt) {
        
        if (((item.amount / wetTotals) * (wetWeight * dryWeight * 0.01))>30){
          let itemAmount = ((item.amount / wetTotals) * (wetWeight * dryWeight * 0.01))
          let bags = Math.floor(itemAmount/30)
          item.amount = wetTotals * (((wetWeight* dryWeight * 0.01)-(30 * bags))/(wetWeight* dryWeight * 0.01))
          doc.text(`30 lb. buckets ${item.componentName}`, 1.2, ct);
        doc.text(
          `${bags}`,
          0.3,
          ct
        );
        
        ct += 0.24;
        }
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(
          `${((item.amount / wetTotals) * wetWeight * dryWeight * 0.01).toFixed(
            2
          )}`,
          0.3,
          ct
        );
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }

    let levNameList = Array.from(
      new Set(
        components
          .filter((com) => com.componentType === "lev")
          .map((it) => it.componentName)
      )
    );
    for (let lev of levNameList) {
      let levFilt = doughComponents.filter((dgh) => dgh.dough === lev);

      let levList = doughComponents
        .filter((dgh) => dgh.dough === lev)
        .map((it) => it.amount);
      let levTotals;
      levList.length > 0
        ? (levTotals = levList.reduce(addUp))
        : (levTotals = 0);

      let levPercent =
        components[components.findIndex((comp) => comp.componentName === lev)]
          .amount * 0.01;
      console.log(levPercent);
      if (levFilt.length > 0) {
        doc.addPage({
          format: [2, 4],
          orientation: "l",
        });
        doc.setFontSize(14);
        doc.text(`${doughName} - ${lev}`, 0.2, 0.36);
        doc.setFontSize(10)
        doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)

        doc.setFontSize(12);
        let ct = 0.7;
        for (let item of levFilt) {
          doc.text(`${item.componentName}`, 1.2, ct);
          doc.text(
            `${((item.amount / levTotals) * levPercent * dryWeight).toFixed(
              2
            )}`,
            0.3,
            ct
          );
          doc.text(`lb.`, 0.8, ct);
          ct += 0.24;
        }
      }
    }
    let postFilt = components.filter((dgh) => dgh.componentType === "post");
    if (postFilt.length > 0) {
      doc.addPage({
        format: [2, 4],
        orientation: "l",
      });
      doc.setFontSize(14);
      doc.text(`${doughName} - Add ins`, 0.2, 0.36);
      doc.setFontSize(10)
      doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)

      doc.setFontSize(12);
      let ct = 0.7;
      for (let item of postFilt) {
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(`${(item.amount * dryWeight * 0.01).toFixed(2)}`, 0.3, ct);
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }

    let saltyeastFilt = components.filter(
      (dgh) =>
        dgh.componentType === "dryplus" &&
        (dgh.componentName === "Salt" ||
        dgh.componentName === "Yeast")
    );
    if (saltyeastFilt.length > 0) {
      doc.addPage({
        format: [2, 4],
        orientation: "l",
      });
      doc.setFontSize(14);
      doc.text(`${doughName} - Salt & Yeast`, 0.2, 0.36);
      doc.setFontSize(10)
      doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)

      doc.setFontSize(12);
      let ct = 0.7;
      for (let item of saltyeastFilt) {
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(`${(item.amount * dryWeight * 0.01).toFixed(2)}`, 0.3, ct);
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }
    if (doughName === "French"){
    doc.addPage({
      format: [2, 4],
      orientation: "l",
    });
    ct = 0.7;
    for (let item of pockets){
      doc.text(`${item.pocketSize}`, 1.2, ct);
        doc.text(`${item.qty}`, 0.3, ct);
        doc.text(`x.`, 0.8, ct);
        ct += 0.24;
    }
  }

    doc.save(`${doughName}Stickers.pdf`);
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>BPBS French Mix/Pocket</h1>
        {doughs.map((dough) => (
          <React.Fragment key={dough.id + "_firstFrag"}>
            <h3>
              {dough.doughName}: (need {dough.needed} lb.) TOTAL:
              {Number(Number(dough.needed) + Number(dough.buffer))}
            </h3>
            <ThreeColumnGrid key={dough.id + "_first2Col"}>
              <div>
                <TwoColumnGrid key={dough.id + "_second2Col"}>
                  <span>Old Dough:</span>
                  <div className="p-inputgroup">
                    <InputText
                      key={dough.id + "_oldDough"}
                      id={dough.id + "_oldDough"}
                      placeholder={dough.oldDough}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </TwoColumnGrid>
                <TwoColumnGrid key={dough.id + "_third2Col"}>
                  <span>Buffer Dough:</span>
                  <div className="p-inputgroup">
                    <InputText
                      key={dough.id + "_buffer"}
                      id={dough.id + "_buffer"}
                      placeholder={dough.buffer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </TwoColumnGrid>
              </div>
              <button
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.buffer) +
                      Number(dough.needed) -
                      Number(dough.oldDough)
                  )
                }
                label="Print Sticker Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                Print Sticker Set
              </button>
              <button
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.batchSize)
                  )
                }
                label="Print Sticker Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                Print Default Sticker Set
              </button>
            </ThreeColumnGrid>
          </React.Fragment>
        ))}
        <WholeBox>
            <h3>French Pockets</h3>
            <DataTable value={pockets} className="p-datatable-sm">
              <Column field="pocketSize" header="Pocket Size"></Column>
              <Column field="qty" header="Qty"></Column>
            </DataTable>
          </WholeBox>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBSMixPocket;
