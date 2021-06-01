import React, { useState, useEffect, useContext } from "react";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { promisedData } from "../../helpers/databaseFetchers";
import ComposeDough from "./BPBNSetOutUtils/composeDough";
import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";

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

const addUp = (acc, val) => {
  return acc + val;
};

const clonedeep = require("lodash.clonedeep");
const compose = new ComposeDough();

function BPBNBaker1Dough() {
  const { setIsLoading } = useContext(ToggleContext);

  const [doughs, setDoughs] = useState([]);
  const [doughComponents, setDoughComponents] = useState([]);
  const [bagAndEpiCount, setBagAndEpiCount] = useState([]);
  const [oliveCount, setOliveCount] = useState([]);
  const [bcCount, setBcCount] = useState([]);
  const [bagDoughTwoDays, setBagDoughTwoDays] = useState([]);

  let tomorrow = todayPlus()[1];
  let today = todayPlus()[0];
  let twoDay = todayPlus()[2];

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherDoughInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherDoughInfo = (database) => {
    let doughData = compose.returnDoughBreakDown(tomorrow, database, "Carlton");
    setDoughs(doughData.Baker1Dough);
    setDoughComponents(doughData.Baker1DoughComponents);
    setBagAndEpiCount(doughData.bagAndEpiCount);
    setOliveCount(doughData.oliveCount);
    setBcCount(doughData.bcCount);
    setBagDoughTwoDays(doughData.bagDoughTwoDays);
  };

  const handleChange = (e) => {
    if (e.code === "Enter") {
      updateDoughDB(e);
    }
  };

  const handleBlur = (e) => {
    updateDoughDB(e);
  };

  

  let baguetteBins = Math.ceil(bagAndEpiCount / 24);
  let oliveWeight = (oliveCount * 1.4).toFixed(2);
  let bcWeight = (bcCount * 1.4).toFixed(2);
  let fullPockets = Math.floor(bagAndEpiCount / 16);
  let extraPockets = bagAndEpiCount % 16;
  let bucketSets = bagDoughTwoDays;

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
  /*
  const exportPastryPrepPdf = async () => {

    // UPDATE preshaped Nombers
    console.log(doughs);
    let updateDetails = {
      id: doughs[0].id,
      bucketSets: bucketSets,
    };

    try {
      await API.graphql(
        graphqlOperation(updateDough, { input: { ...updateDetails } })
      );
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  
    

    let finalY;
    let pageMargin = 20;
    let tableToNextTitle = 8;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;
    let nextColumn = 50;

    let ct = 16;
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(
      pageMargin,
      20,
      `What To Mix ${convertDatetoBPBDate(today)}`
    );

    ct +=10
    doc.text(pageMargin, (ct += tableToNextTitle), `Baguette Mix #1`);
    doc.setFontSize(12);
    doc.text(pageMargin, (ct += tableToNextTitle), `Bucket Sets`);
    doc.text(pageMargin + nextColumn, ct, `${doughs[0].bucketSets} (L and P)`);
    doc.text(pageMargin, (ct += tableToNextTitle), `Old Dough`);
    doc.text(pageMargin + nextColumn, ct, `${doughs[0].oldDough} lb.`);
    doc.text(pageMargin, (ct += tableToNextTitle), `50 lb. Bread Flour`);
    doc.text(
      pageMargin + nextColumn,
      ct,
      `${Math.floor((0.575 * baseNum(doughs[0], 1)) / 50)}`
    );
    doc.text(pageMargin, (ct += tableToNextTitle), `25 lb. Bucket Water`);
    doc.text(
      pageMargin + nextColumn,
      ct,
      `${Math.floor((0.372 * baseNum(doughs[0], 1)) / 25)}`
    );
    doc.text(pageMargin, (ct += tableToNextTitle), `Bread Flour`);
    doc.text(
      pageMargin + nextColumn,
      ct,
      `${((0.575 * baseNum(doughs[0], 1)) % 50).toFixed(2)} lb.`
    );
    doc.text(pageMargin, (ct += tableToNextTitle), `Whole Wheat Flour`);
    doc.text(
      pageMargin + nextColumn,
      ct,
      `${(0.038 * baseNum(doughs[0], 1)).toFixed(2)} lb.`
    );
    doc.text(pageMargin, (ct += tableToNextTitle), `Water`);
    doc.text(
      pageMargin + nextColumn,
      ct,
      `${((0.372 * baseNum(doughs[0], 1)) % 25).toFixed(2)} lb.`
    );
    doc.text(pageMargin, (ct += tableToNextTitle), `Salt`);
    doc.text(
      pageMargin + nextColumn,
      ct,
      `${(0.013 * baseNum(doughs[0], 1)).toFixed(2)} lb.`
    );
    doc.text(pageMargin, (ct += tableToNextTitle), `Yeast`);
    doc.text(
      pageMargin + nextColumn,
      ct,
      `${(0.002 * baseNum(doughs[0], 1)).toFixed(2)} lb.`
    );

    if (doughs[0].bucketSets > 2) {
      doc.text(pageMargin, (ct += tableToNextTitle), `Baguette Mix #2`);
      doc.setFontSize(14);
      doc.text(pageMargin, (ct += tableToNextTitle), `Bucket Sets`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${doughs[0].bucketSets} (L and P)`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Old Dough`);
      doc.text(pageMargin + nextColumn, ct, `${doughs[0].oldDough} lb.`);
      doc.text(pageMargin, (ct += tableToNextTitle), `50 lb. Bread Flour`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${Math.floor((0.575 * baseNum(doughs[0], 2)) / 50)}`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `25 lb. Bucket Water`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${Math.floor((0.372 * baseNum(doughs[0], 2)) / 25)}`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Bread Flour`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${((0.575 * baseNum(doughs[0], 2)) % 50).toFixed(2)} lb.`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Whole Wheat Flour`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${(0.038 * baseNum(doughs[0], 2)).toFixed(2)} lb.`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Water`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${((0.372 * baseNum(doughs[0], 2)) % 25).toFixed(2)} lb.`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Salt`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${(0.013 * baseNum(doughs[0], 2)).toFixed(2)} lb.`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Yeast`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${(0.002 * baseNum(doughs[0], 2)).toFixed(2)} lb.`
      );
    }

    if (doughs[0].bucketSets > 4) {
      doc.text(pageMargin, (ct += tableToNextTitle), `Baguette Mix #2`);
      doc.setFontSize(14);
      doc.text(pageMargin, (ct += tableToNextTitle), `Bucket Sets`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${doughs[0].bucketSets} (L and P)`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Old Dough`);
      doc.text(pageMargin + nextColumn, ct, `${doughs[0].oldDough} lb.`);
      doc.text(pageMargin, (ct += tableToNextTitle), `50 lb. Bread Flour`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${Math.floor((0.575 * baseNum(doughs[0], 3)) / 50)}`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `25 lb. Bucket Water`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${Math.floor((0.372 * baseNum(doughs[0], 3)) / 25)}`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Bread Flour`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${((0.575 * baseNum(doughs[0], 3)) % 50).toFixed(2)} lb.`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Whole Wheat Flour`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${(0.038 * baseNum(doughs[0], 3)).toFixed(2)} lb.`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Water`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${((0.372 * baseNum(doughs[0], 3)) % 25).toFixed(2)} lb.`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Salt`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${(0.013 * baseNum(doughs[0], 2)).toFixed(2)} lb.`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Yeast`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${(0.002 * baseNum(doughs[0], 2)).toFixed(2)} lb.`
      );
    }
    doc.setFontSize(20);

    doc.text(pageMargin, (ct += tableToNextTitle+10), `Bins`);
    doc.setFontSize(12);
    doc.text(pageMargin, (ct += tableToNextTitle), `Baguette (27.7)`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${baguetteBins}`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Olive Herb`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${oliveWeight} lb.`
      );
      doc.text(pageMargin, (ct += tableToNextTitle), `Blue Cheese Walnut`);
      doc.text(
        pageMargin + nextColumn,
        ct,
        `${bcWeight} lb.`
      );

      doc.setFontSize(20);

      doc.text(pageMargin, (ct += tableToNextTitle+10), `Pocket Pans`);
      doc.setFontSize(12);
      doc.text(pageMargin, (ct += tableToNextTitle), `Full (16 per pan)`);
        doc.text(
          pageMargin + nextColumn,
          ct,
          `${fullPockets}`
        );
        doc.text(pageMargin, (ct += tableToNextTitle), `Extra`);
        doc.text(
          pageMargin + nextColumn,
          ct,
          `${extraPockets}`
        );

        doc.setFontSize(20);

        doc.text(pageMargin, (ct += tableToNextTitle+10), `Bucket Sets`);
        doc.setFontSize(12);
        doc.text(pageMargin, (ct += tableToNextTitle), `Water (25 lb.)`);
          doc.text(
            pageMargin + nextColumn,
            ct,
            `${bucketSets}`
          );

    doc.save(`BaguetteMix${today}.pdf`);
  };
  */
  
  /*
  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportPastryPrepPdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Baguette Mix
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );
    */

  const doughMixList = (dough) => {
    let mixes = Math.ceil(dough.needed / 210);
    let multiple1 = 1 / mixes;
    let multiple2 = 1 / mixes;
    let multiple3 = 1 / mixes;

    if (mixes===2 && dough.bucketSets===3){
      multiple1 *= 1.33
      multiple2 *= .66
    }

    if (mixes===3 && dough.bucketSets===4){
      multiple1 *=1.5
      multiple2 *=.75
      multiple3 *=.75
    }

    if (mixes===3 && dough.bucketSets===5){
      multiple1 *=1.2
      multiple2 *=1.2
      multiple3 *=.60
    }
    let oldDoughAdjusted = dough.oldDough;
    let stickerAmount = Number(
      Number(dough.needed) + Number(dough.buffer) + Number(dough.short)
    );

    if (oldDoughAdjusted > stickerAmount / 3) {
      oldDoughAdjusted = stickerAmount / 3;
    }
    stickerAmount -= oldDoughAdjusted;


    return (
      <React.Fragment key={dough.id + "_firstFrag"}>
        <h3>
          {dough.doughName}: (need {dough.needed} lb.) TOTAL:
          {Number(
            Number(dough.needed) + Number(dough.buffer) + Number(dough.short)
          )}{" "}
          SHORT: {Number(dough.short)}
        </h3>
        <TwoColumnGrid key={dough.id + "_first2Col"}>
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
        </TwoColumnGrid>

        <h2>Baguette Mix #1</h2>
        <TwoColumnGrid>
          <div>Bucket Sets</div>
          <div>{Math.round(dough.bucketSets * multiple1)} (L and P)</div>
          <div>Old Dough</div>
          <div>{dough.oldDough * multiple1} lb.</div>
          <div>50 lb. Bread Flour</div>
          <div>
            {Math.floor(
              ((0.575 * stickerAmount - bucketSets * 19.22) * multiple1) / 50
            )}
          </div>
          <div>25 lb. Bucket Water</div>
          <div>
            {Math.floor(
              ((0.372 * stickerAmount - bucketSets * 19.22) * multiple1) / 25
            )}
          </div>
          <div> </div>
          <div> </div>
          <div>Bread Flour</div>
          <div>
            {(
              ((0.575 * stickerAmount - bucketSets * 19.22) * multiple1) %
              50
            ).toFixed(2)}{" "}
            lb.
          </div>
          <div>Whole Wheat Flour</div>
          <div>{(0.038 * stickerAmount * multiple1).toFixed(2)} lb.</div>
          <div>Water</div>
          <div>
            {(
              ((0.372 * stickerAmount - bucketSets * 19.22) * multiple1) %
              25
            ).toFixed(2)}{" "}
            lb.
          </div>
          <div>Salt</div>
          <div>{(0.013 * stickerAmount * multiple1).toFixed(2)} lb.</div>
          <div>Yeast</div>
          <div>{(0.002 * stickerAmount * multiple1).toFixed(2)} lb.</div>
        </TwoColumnGrid>

        {mixes > 1 && (
          <React.Fragment>
            <h2>Baguette Mix #2</h2>
            <TwoColumnGrid>
              <div>Bucket Sets</div>
              <div>{Math.round(dough.bucketSets * multiple2)} (L and P)</div>
              <div>Old Dough</div>
              <div>{dough.oldDough * multiple2} lb.</div>
              <div>50 lb. Bread Flour</div>
              <div>
                {Math.floor(
                  ((0.575 * stickerAmount - bucketSets * 19.22) * multiple2) /
                    50
                )}
              </div>
              <div>25 lb. Bucket Water</div>
              <div>
                {Math.floor(
                  ((0.372 * stickerAmount - bucketSets * 19.22) * multiple2) /
                    25
                )}
              </div>
              <div> </div>
              <div> </div>
              <div>Bread Flour</div>
              <div>
                {(
                  ((0.575 * stickerAmount - bucketSets * 19.22) * multiple2) %
                  50
                ).toFixed(2)}{" "}
                lb.
              </div>
              <div>Whole Wheat Flour</div>
              <div>{(0.038 * stickerAmount * multiple2).toFixed(2)} lb.</div>
              <div>Water</div>
              <div>
                {(
                  ((0.372 * stickerAmount - bucketSets * 19.22) * multiple2) %
                  25
                ).toFixed(2)}{" "}
                lb.
              </div>
              <div>Salt</div>
              <div>{(0.013 * stickerAmount * multiple2).toFixed(2)} lb.</div>
              <div>Yeast</div>
              <div>{(0.002 * stickerAmount * multiple2).toFixed(2)} lb.</div>
            </TwoColumnGrid>
          </React.Fragment>
        )}
        {mixes > 2 && (
          <React.Fragment>
            <h2>Baguette Mix #3</h2>
            <TwoColumnGrid>
              <div>Bucket Sets</div>
              <div>{Math.round(dough.bucketSets * multiple3)} (L and P)</div>
              <div>Old Dough</div>
              <div>{dough.oldDough * multiple3} lb.</div>
              <div>50 lb. Bread Flour</div>
              <div>
                {Math.floor(
                  ((0.575 * stickerAmount - bucketSets * 19.22) * multiple3) /
                    50
                )}
              </div>
              <div>25 lb. Bucket Water</div>
              <div>
                {Math.floor(
                  ((0.372 * stickerAmount - bucketSets * 19.22) * multiple3) /
                    25
                )}
              </div>
              <div> </div>
              <div> </div>
              <div>Bread Flour</div>
              <div>
                {(
                  ((0.575 * stickerAmount - bucketSets * 19.22) * multiple3) %
                  50
                ).toFixed(2)}{" "}
                lb.
              </div>
              <div>Whole Wheat Flour</div>
              <div>{(0.038 * stickerAmount * multiple3).toFixed(2)} lb.</div>
              <div>Water</div>
              <div>
                {(
                  ((0.372 * stickerAmount - bucketSets * 19.22) * multiple3) %
                  25
                ).toFixed(2)}{" "}
                lb.
              </div>
              <div>Salt</div>
              <div>{(0.013 * stickerAmount * multiple3).toFixed(2)} lb.</div>
              <div>Yeast</div>
              <div>{(0.002 * stickerAmount * multiple3).toFixed(2)} lb.</div>
            </TwoColumnGrid>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <WholeBox>
        <h1>BPBN Baguette Mix</h1>
        {/*<div>{header}</div>*/}
        {doughs.map((dough) => doughMixList(dough))}

        <h2>Bins</h2>
        <TwoColumnGrid>
          <div>Baguette (27.7)</div>
          <div>{baguetteBins}</div>
          <div>Olive</div>
          <div>{oliveWeight}</div>
          <div>BC Walnut</div>
          <div>{bcWeight}</div>
        </TwoColumnGrid>

        <h2>Pocket Pans</h2>
        <TwoColumnGrid>
          <div>Full (16 per pan)</div>
          <div>{fullPockets}</div>
          <div>Extra</div>
          <div>{extraPockets}</div>
        </TwoColumnGrid>

        <h2>Bucket Sets</h2>
        <TwoColumnGrid>
          <div>Bucket Sets</div>
          <div>{bucketSets}</div>
        </TwoColumnGrid>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNBaker1Dough;
