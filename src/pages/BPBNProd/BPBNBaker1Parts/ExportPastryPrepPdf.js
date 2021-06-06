import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate } from "../../../helpers/dateTimeHelpers";

let finalY;
let pageMargin = 20;
let tableToNextTitle = 12;
let titleToNextTable = tableToNextTitle + 4;
let tableFont = 11;
let titleFont = 14;

const getMixInfo = (doughs, infoWrap) => {
  let dough = doughs[0];
  let multiple = [];

  let baguetteBins = Math.ceil(infoWrap.bagAndEpiCount / 24);
  let oliveWeight = (infoWrap.oliveCount * 1.4).toFixed(2);
  let bcWeight = (infoWrap.bcCount * 1.4).toFixed(2);
  let fullPockets = Math.floor(infoWrap.bagAndEpiCount / 16);
  let extraPockets = infoWrap.bagAndEpiCount % 16;
  let bucketSets = infoWrap.bagDoughTwoDays;

  let doughTotal =
    Number(dough.needed) + Number(dough.buffer) + Number(dough.short);

  let mixes = Math.ceil(doughTotal / 210);
  multiple[0] = 1 / mixes;
  multiple[1] = 1 / mixes;
  multiple[2] = 1 / mixes;

  if (mixes === 2 && dough.bucketSets === 3) {
    multiple[0] *= 1.33;
    multiple[1] *= 0.66;
  }

  if (mixes === 3 && dough.bucketSets === 4) {
    multiple[0] *= 1.5;
    multiple[1] *= 0.75;
    multiple[2] *= 0.75;
  }

  if (mixes === 3 && dough.bucketSets === 5) {
    multiple[0] *= 1.2;
    multiple[1] *= 1.2;
    multiple[2] *= 0.6;
  }
  let oldDoughAdjusted = dough.oldDough;
  let stickerAmount = Number(
    Number(dough.needed) + Number(dough.buffer) + Number(dough.short)
  );

  if (oldDoughAdjusted > stickerAmount / 3) {
    oldDoughAdjusted = stickerAmount / 3;
  }
  stickerAmount -= oldDoughAdjusted;

  return [dough, multiple, stickerAmount, bucketSets, mixes];
};

const mixInfo = (doughs, infoWrap, multi) => {
  //  Set up Mix 1

  let [dough, multiple, stickerAmount, bucketSets, mixes] = getMixInfo(
    doughs,
    infoWrap
  );

  let Mix1BucketSets = Math.round(dough.bucketSets * multiple[multi]);
  let Mix1OldDough = dough.oldDough * multiple[multi];
  let Mix150lbFlour = Math.floor(
    ((0.575 * stickerAmount - bucketSets * 19.22) * multiple[multi]) / 50
  );
  let Mix125lbWater = Math.floor(
    ((0.372 * stickerAmount - bucketSets * 19.22) * multiple[multi]) / 25
  );
  let Mix1BreadFlour = (
    ((0.575 * stickerAmount - bucketSets * 19.22) * multiple[multi]) %
    50
  ).toFixed(2);
  let Mix1WholeWheat = (0.038 * stickerAmount * multiple[multi]).toFixed(2);
  let Mix1Water = (
    ((0.372 * stickerAmount - bucketSets * 19.22) * multiple[multi]) %
    25
  ).toFixed(2);
  let Mix1Salt = (0.013 * stickerAmount * multiple[multi]).toFixed(2);
  let Mix1Yeast = (0.002 * stickerAmount * multiple[multi]).toFixed(2);

  return [
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
};

export const ExportPastryPrepPdf = async (delivDate, doughs, infoWrap) => {
  let [dough, multiple1, multiple2, stickerAmount, bucketSets, mixes] =
    getMixInfo(doughs, infoWrap);

  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(20);
  doc.text(pageMargin, 20, `What To Bake ${convertDatetoBPBDate(delivDate)}`);

  finalY = 20;

  doc.setFontSize(titleFont);
  doc.text(pageMargin, finalY + tableToNextTitle, `Bake List`);

  doc.autoTable({
    theme: "grid",
    body: infoWrap.whatToMake,
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
    body: infoWrap.whatToPrep,
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

  doc.setFontSize(titleFont);
  doc.text(pageMargin, finalY + tableToNextTitle, `Baguette Mix #1`);

  console.log(mixInfo(doughs, infoWrap, 0))

  doc.autoTable({
    theme: "grid",
    body: mixInfo(doughs, infoWrap, 0),
    margin: pageMargin,
    columns: [
      { header: "Ingredient", dataKey: "title" },
      { header: "Amount", dataKey: "amount" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
  });

  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  doc.setFontSize(titleFont);
  doc.text(pageMargin, finalY + tableToNextTitle, `Baguette Mix #2`);

  console.log(mixInfo(doughs, infoWrap, 1))

  doc.autoTable({
    theme: "grid",
    body: mixInfo(doughs, infoWrap, 1),
    margin: pageMargin,
    columns: [
      { header: "Ingredient", dataKey: "title" },
      { header: "Amount", dataKey: "amount" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
  });

  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  doc.save(`WhatToShape${delivDate}.pdf`);
};
