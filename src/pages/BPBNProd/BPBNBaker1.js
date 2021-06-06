import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeWhatToBake from "./BPBNSetOutUtils/composeWhatToBake";

import BPBNBaker1Dough from "./BPBNBaker1Dough";
import BPBNBaker1WhatToPrep from "./BPBNBaker1WhatToPrep.js";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
`;

const ButtonWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 60%;
  flex-direction: row;
  justify-content: space-between;
  align-content: left;

  background: #ffffff;
`;

const compose = new ComposeWhatToBake();

function BPBNBaker1() {
  const { setIsLoading } = useContext(ToggleContext);
  const [whatToMake, setWhatToMake] = useState([]);
  const [whatToPrep, setWhatToPrep] = useState([]);
  const [doughs, setDoughs] = useState([]);
  const [doughComponents, setDoughComponents] = useState([]);
  const [bagAndEpiCount, setBagAndEpiCount] = useState([]);
  const [oliveCount, setOliveCount] = useState([]);
  const [bcCount, setBcCount] = useState([]);
  const [bagDoughTwoDays, setBagDoughTwoDays] = useState([]);
  const [titleInfo, setTitleInfo] = useState();
  const [mix1Info, setMix1Info] = useState();

  let delivDate = todayPlus()[0];

  useEffect(() => {
    promisedData(setIsLoading).then((database) =>
      gatherWhatToMakeInfo(database)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToMakeInfo = (database) => {
    let whatToMakeData = compose.returnWhatToMakeBreakDown(delivDate, database);
    setWhatToMake(whatToMakeData.whatToMake);
  };

  const exportPastryPrepPdf = async () => {
    let finalY;
    let pageMargin = 20;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `What To Bake ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Bake List`);

    doc.autoTable({
      theme: "grid",
      body: whatToMake,
      margin: pageMargin,
      columns: [
        { header: "Product", dataKey: "forBake" },
        { header: "Qty", dataKey: "qty" },
        { header: "Shaped", dataKey: "shaped" },
        { header: "Short", dataKey: "short" },
        { header: "Need Early", dataKey: "needEarly" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY + tableToNextTitle;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Prep List`);

    doc.autoTable({
      theme: "grid",
      body: whatToPrep,
      margin: pageMargin,
      columns: [
        { header: "Product", dataKey: "prodName" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY + tableToNextTitle;

    doc.addPage();
    finalY = 20;

    //  Set up Mix 1

    let dough = doughs[0];

    let baguetteBins = Math.ceil(bagAndEpiCount / 24);
    let oliveWeight = (oliveCount * 1.4).toFixed(2);
    let bcWeight = (bcCount * 1.4).toFixed(2);
    let fullPockets = Math.floor(bagAndEpiCount / 16);
    let extraPockets = bagAndEpiCount % 16;
    let bucketSets = bagDoughTwoDays;

    let mixes = Math.ceil(dough.needed / 210);
    let multiple1 = 1 / mixes;
    let multiple2 = 1 / mixes;
    let multiple3 = 1 / mixes;

    if (mixes === 2 && dough.bucketSets === 3) {
      multiple1 *= 1.33;
      multiple2 *= 0.66;
    }

    if (mixes === 3 && dough.bucketSets === 4) {
      multiple1 *= 1.5;
      multiple2 *= 0.75;
      multiple3 *= 0.75;
    }

    if (mixes === 3 && dough.bucketSets === 5) {
      multiple1 *= 1.2;
      multiple2 *= 1.2;
      multiple3 *= 0.6;
    }
    let oldDoughAdjusted = dough.oldDough;
    let stickerAmount = Number(
      Number(dough.needed) + Number(dough.buffer) + Number(dough.short)
    );

    if (oldDoughAdjusted > stickerAmount / 3) {
      oldDoughAdjusted = stickerAmount / 3;
    }
    stickerAmount -= oldDoughAdjusted;

    let Mix1BucketSets = Math.round(dough.bucketSets * multiple1);
    let Mix1OldDough = dough.oldDough * multiple1;
    let Mix150lbFlour = Math.floor(
      ((0.575 * stickerAmount - bucketSets * 19.22) * multiple1) / 50
    );
    let Mix125lbWater = Math.floor(
      ((0.372 * stickerAmount - bucketSets * 19.22) * multiple1) / 25
    );
    let Mix1BreadFlour = (
      ((0.575 * stickerAmount - bucketSets * 19.22) * multiple1) %
      50
    ).toFixed(2);
    let Mix1WholeWheat = (0.038 * stickerAmount * multiple1).toFixed(2);
    let Mix1Water = (
      ((0.372 * stickerAmount - bucketSets * 19.22) * multiple1) %
      25
    ).toFixed(2);
    let Mix1Salt = (0.013 * stickerAmount * multiple1).toFixed(2);
    let Mix1Yeast = (0.002 * stickerAmount * multiple1).toFixed(2);

    let mix1Info = [
      { title: "Bucket Sets", amount: Mix1BucketSets },
      { title: "Old Dough", amount: Mix1OldDough },
      { title: "50 lb. Bread Flour", amount: Mix150lbFlour },
      { title: "25 lb. Bucket Water", amount: Mix125lbWater },
      { title: "Bread Flour", amount: Mix1BreadFlour },
      { title: "Whole Wheat Flour", amount: Mix1WholeWheat },
      { title: "Water", amount: Mix1Water },
      { title: "Salt", amount: Mix1Salt },
      { title: "Yeast", amount: Mix1Yeast },
    ];

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Baguette Mix #1`);

    doc.autoTable({
      theme: "grid",
      body: mix1Info,
      margin: pageMargin,
      columns: [
        { header: "Ingredient", dataKey: "title" },
        { header: "Amount", dataKey: "amount" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY + tableToNextTitle;

    //  Set up Mix 2

    if (mixes > 1) {
      let Mix2BucketSets = Math.round(dough.bucketSets * multiple2);
      let Mix2OldDough = dough.oldDough * multiple2;
      let Mix250lbFlour = Math.floor(
        ((0.575 * stickerAmount - bucketSets * 19.22) * multiple2) / 50
      );
      let Mix225lbWater = Math.floor(
        ((0.372 * stickerAmount - bucketSets * 19.22) * multiple2) / 25
      );
      let Mix2BreadFlour = (
        ((0.575 * stickerAmount - bucketSets * 19.22) * multiple2) %
        50
      ).toFixed(2);
      let Mix2WholeWheat = (0.038 * stickerAmount * multiple2).toFixed(2);
      let Mix2Water = (
        ((0.372 * stickerAmount - bucketSets * 19.22) * multiple2) %
        25
      ).toFixed(2);
      let Mix2Salt = (0.013 * stickerAmount * multiple2).toFixed(2);
      let Mix2Yeast = (0.002 * stickerAmount * multiple2).toFixed(2);

      let mix2Info = [
        { title: "Bucket Sets", amount: Mix2BucketSets },
        { title: "Old Dough", amount: Mix2OldDough },
        { title: "50 lb. Bread Flour", amount: Mix250lbFlour },
        { title: "25 lb. Bucket Water", amount: Mix225lbWater },
        { title: "Bread Flour", amount: Mix2BreadFlour },
        { title: "Whole Wheat Flour", amount: Mix2WholeWheat },
        { title: "Water", amount: Mix2Water },
        { title: "Salt", amount: Mix2Salt },
        { title: "Yeast", amount: Mix2Yeast },
      ];

      doc.setFontSize(titleFont);
      doc.text(pageMargin, finalY + tableToNextTitle, `Baguette Mix #2`);

      doc.autoTable({
        theme: "grid",
        body: mix2Info,
        margin: pageMargin,
        columns: [
          { header: "Ingredient", dataKey: "title" },
          { header: "Amount", dataKey: "amount" },
        ],
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });

      finalY = doc.previousAutoTable.finalY + tableToNextTitle;
    }

    if (mixes > 2) {
      let Mix3BucketSets = Math.round(dough.bucketSets * multiple3);
      let Mix3OldDough = dough.oldDough * multiple3;
      let Mix350lbFlour = Math.floor(
        ((0.575 * stickerAmount - bucketSets * 19.22) * multiple3) / 50
      );
      let Mix325lbWater = Math.floor(
        ((0.372 * stickerAmount - bucketSets * 19.22) * multiple3) / 25
      );
      let Mix3BreadFlour = (
        ((0.575 * stickerAmount - bucketSets * 19.22) * multiple3) %
        50
      ).toFixed(2);
      let Mix3WholeWheat = (0.038 * stickerAmount * multiple3).toFixed(2);
      let Mix3Water = (
        ((0.372 * stickerAmount - bucketSets * 19.22) * multiple3) %
        25
      ).toFixed(2);
      let Mix3Salt = (0.013 * stickerAmount * multiple3).toFixed(2);
      let Mix3Yeast = (0.002 * stickerAmount * multiple3).toFixed(2);

      let mix3Info = [
        { title: "Bucket Sets", amount: Mix3BucketSets },
        { title: "Old Dough", amount: Mix3OldDough },
        { title: "50 lb. Bread Flour", amount: Mix350lbFlour },
        { title: "25 lb. Bucket Water", amount: Mix325lbWater },
        { title: "Bread Flour", amount: Mix3BreadFlour },
        { title: "Whole Wheat Flour", amount: Mix3WholeWheat },
        { title: "Water", amount: Mix3Water },
        { title: "Salt", amount: Mix3Salt },
        { title: "Yeast", amount: Mix3Yeast },
      ];

      doc.setFontSize(titleFont);
      doc.text(pageMargin, finalY + tableToNextTitle, `Baguette Mix #3`);

      doc.autoTable({
        theme: "grid",
        body: mix3Info,
        margin: pageMargin,
        columns: [
          { header: "Ingredient", dataKey: "title" },
          { header: "Amount", dataKey: "amount" },
        ],
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });

      finalY = doc.previousAutoTable.finalY + tableToNextTitle;
    }

    doc.save(`WhatToShape${delivDate}.pdf`);
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportPastryPrepPdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print AM Bake List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>What To Bake {convertDatetoBPBDate(delivDate)}</h1>
        <div>{header}</div>

        <DataTable value={whatToMake} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
          <Column field="shaped" header="Shaped"></Column>
          <Column field="short" header="Short"></Column>
          <Column field="needEarly" header="Need Early"></Column>
        </DataTable>
      </WholeBox>
      <BPBNBaker1WhatToPrep
        whatToPrep={whatToPrep}
        setWhatToPrep={setWhatToPrep}
      />
      <BPBNBaker1Dough
        doughs={doughs}
        setDoughs={setDoughs}
        doughComponents={doughComponents}
        setDoughComponents={setDoughComponents}
        bagAndEpiCount={bagAndEpiCount}
        setBagAndEpiCount={setBagAndEpiCount}
        oliveCount={oliveCount}
        setOliveCount={setOliveCount}
        bcCount={bcCount}
        setBcCount={setBcCount}
        bagDoughTwoDays={bagDoughTwoDays}
        setBagDoughTwoDays={setBagDoughTwoDays}
        setTitleInfo={setTitleInfo}
        setMix1Info={setMix1Info}
      />
    </React.Fragment>
  );
}

export default BPBNBaker1;
