import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate } from "../../../helpers/dateTimeHelpers";
import { mixFormula } from "./MixFormula";
import { getMixInfo } from "./GetMixInfo";

import { binInfo } from "./BinInfo";
import { panAmount } from "./PanAmount";
import { bucketAmount } from "./BucketAmount";

let finalY;
let pageMargin = 20;
let tableToNextTitle = 12;
let titleToNextTable = tableToNextTitle + 4;
let tableFont = 11;
let titleFont = 14;

export const ExportPastryPrepPdf = async (delivDate, doughs, infoWrap) => {
  let mixes = getMixInfo(doughs, infoWrap)[4];

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

  console.log(getMixInfo(doughs, infoWrap))

  for (let i = 0; i < mixes; i++) {
    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Baguette Mix #${i + 1}`);

    doc.autoTable({
      theme: "grid",
      body: mixFormula(doughs, infoWrap, i),
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

  doc.addPage();
  finalY = 20;

  doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Bins`);

    doc.autoTable({
      theme: "grid",
      body: binInfo(doughs, infoWrap),
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
    doc.text(pageMargin, finalY + tableToNextTitle, `Pans`);

    doc.autoTable({
      theme: "grid",
      body: panAmount(doughs, infoWrap),
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
    doc.text(pageMargin, finalY + tableToNextTitle, `Buckets`);

    doc.autoTable({
      theme: "grid",
      body: bucketAmount(doughs, infoWrap),
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
