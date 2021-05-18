import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeAMPastry from "./utils/composeAMPastry";

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

const compose = new ComposeAMPastry();

function AMPastry() {
  const { setIsLoading } = useContext(ToggleContext);
  const [AMPastry, setAMPastry] = useState([]);
  const [columnsAMPastry, setColumnsAMPastry] = useState([]);

  let delivDate = todayPlus()[0];

  const createDynamic = (cols) => {
    const dynamicColumns = cols.map((col, i) => {
      return (
        <Column
          npmkey={col.field}
          field={col.field}
          header={col.header}
          key={col.field}
          style={col.width}
        />
      );
    });
    return dynamicColumns;
  };

  const dynamicColumnsAMPastry = createDynamic(columnsAMPastry);

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherMakeInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherMakeInfo = (database) => {
    let AMPastryData = compose.returnAMPastryBreakDown(delivDate, database);
    setAMPastry(AMPastryData.AMPastry);
    setColumnsAMPastry(AMPastryData.columnsAMPastry);
  };

  const exportAMPastryStickers = () => {
    const doc = new jsPDF({
      orientation: "l",
      unit: "in",
      format: [2, 4],
    });

    let ind = 0;
    for (let past of AMPastry) {
      ind += 1;
      doc.setFontSize(14);
      doc.text(`${past.customer} ${convertDatetoBPBDate(delivDate)}`, 0.1, 0.36);

      doc.setFontSize(12);
      past.pl && doc.text(`Pl: ${past.pl}`, 0.2, 0.72);
      past.ch && doc.text(`Ch: ${past.ch}`, 0.2, 1.08);
      past.pg && doc.text(`Pg: ${past.pg}`, 0.2, 1.44);
      past.sf && doc.text(`Sf: ${past.sf}`, 0.2, 1.8);

      past.al && doc.text(`Al: ${past.al}`, 1.46, 0.72);
      past.mb && doc.text(`Mb: ${past.mb}`, 1.46, 1.08);
      past.mini && doc.text(`mini: ${past.mini}`, 1.46, 1.44);
      past.sand && doc.text(`sand: ${past.sand}`, 1.46, 1.8);

      past.bb && doc.text(`BB: ${past.bb}`, 2.72, 0.72);
      past.sco && doc.text(`Sco: ${past.sco}`, 2.72, 1.08);
      past.bd && doc.text(`Bd: ${past.bd}`, 2.72, 1.44);
      if (ind<AMPastry.length){
      doc.addPage({
        format: [2, 4],
        orientation: "l",
      });
    }
    }

    doc.save(`TestSticker.pdf`);
  };

  const exportAMPastryPDF = () => {
    let finalY;
    let pageMargin = 10;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `AM Pastry ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;
    if (columnsAMPastry.length > 0) {
      doc.autoTable({
        body: AMPastry,
        columns: columnsAMPastry,
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }

    doc.save(`AMPastry${delivDate}.pdf`);
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportAMPastryStickers}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print AM Pastry Stickers
        </Button>
        <Button
          type="button"
          onClick={exportAMPastryPDF}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print AM Pastry List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>AM Pastry Pack {convertDatetoBPBDate(delivDate)}</h1>
        <div>{header}</div>

        {AMPastry.length > 0 && (
          <React.Fragment>
            <h3>AM Pastry</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={AMPastry}
            >
              {dynamicColumnsAMPastry}
            </DataTable>{" "}
          </React.Fragment>
        )}
      </WholeBox>
    </React.Fragment>
  );
}

export default AMPastry;
