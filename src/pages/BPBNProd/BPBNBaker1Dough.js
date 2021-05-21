import React, { useState, useEffect, useContext } from "react";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { promisedData } from "../../helpers/databaseFetchers";
import ComposeDough from "./BPBNSetOutUtils/composeDough";
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

  let tomorrow = todayPlus()[1];
  let today = todayPlus()[0];

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherDoughInfo(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherDoughInfo = (database) => {
    let doughData = compose.returnDoughBreakDown(tomorrow, database, "Carlton");
    setDoughs(doughData.Baker1Dough);
    setDoughComponents(doughData.Baker1DoughComponents);
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

  const exportPastryPrepPdf = async (dough) => {

    
    let finalY;
    let pageMargin = 20;
    let tableToNextTitle = 8;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;
    let nextColumn = 50;

    let ct = 16
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    
    
    
      
      doc.text(pageMargin,ct += tableToNextTitle,`Baguette Mix #1`);
      doc.setFontSize(12);
      doc.text(pageMargin,ct += tableToNextTitle,`Bucket Sets`);
      doc.text(pageMargin + nextColumn,ct,`${doughs[0].bucketSets} (L and P)`);
      doc.text(pageMargin,ct += tableToNextTitle,`Old Dough`);
      doc.text(pageMargin + nextColumn,ct,`${doughs[0].oldDough} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`50 lb. Bread Flour`);
      doc.text(pageMargin + nextColumn,ct,`${Math.floor((0.575 * baseNum(doughs[0],1)) / 50)}`);
      doc.text(pageMargin,ct += tableToNextTitle,`25 lb. Bucket Water`);
      doc.text(pageMargin + nextColumn,ct,`${Math.floor((0.372 * baseNum(doughs[0],1)) / 25)}`);
      doc.text(pageMargin,ct += tableToNextTitle,`Bread Flour`);
      doc.text(pageMargin + nextColumn,ct,`${((0.575 * baseNum(doughs[0],1)) % 50).toFixed(2)} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`Whole Wheat Flour`);
      doc.text(pageMargin + nextColumn,ct,`${(0.038 * baseNum(doughs[0],1)).toFixed(2)} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`Water`);
      doc.text(pageMargin + nextColumn,ct,`${((0.372 * baseNum(doughs[0],1)) % 25).toFixed(2)} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`Salt`);
      doc.text(pageMargin + nextColumn,ct,`${(0.013 * baseNum(doughs[0],1)).toFixed(2)} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`Yeast`);
      doc.text(pageMargin + nextColumn,ct,`${(0.002 * baseNum(doughs[0],1)).toFixed(2)} lb.`);
      
      if (doughs[0].bucketSets>2) {
    
      doc.text(pageMargin,ct += tableToNextTitle,`Baguette Mix #2`);
      doc.setFontSize(14);
      doc.text(pageMargin,ct += tableToNextTitle,`Bucket Sets`);
      doc.text(pageMargin + nextColumn,ct,`${doughs[0].bucketSets} (L and P)`);
      doc.text(pageMargin,ct += tableToNextTitle,`Old Dough`);
      doc.text(pageMargin + nextColumn,ct,`${doughs[0].oldDough} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`50 lb. Bread Flour`);
      doc.text(pageMargin + nextColumn,ct,`${Math.floor((0.575 * baseNum(doughs[0],2)) / 50)}`);
      doc.text(pageMargin,ct += tableToNextTitle,`25 lb. Bucket Water`);
      doc.text(pageMargin + nextColumn,ct,`${Math.floor((0.372 * baseNum(doughs[0],2)) / 25)}`);
      doc.text(pageMargin,ct += tableToNextTitle,`Bread Flour`);
      doc.text(pageMargin + nextColumn,ct,`${((0.575 * baseNum(doughs[0],2)) % 50).toFixed(2)} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`Whole Wheat Flour`);
      doc.text(pageMargin + nextColumn,ct,`${(0.038 * baseNum(doughs[0],2)).toFixed(2)} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`Water`);
      doc.text(pageMargin + nextColumn,ct,`${((0.372 * baseNum(doughs[0],2)) % 25).toFixed(2)} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`Salt`);
      doc.text(pageMargin + nextColumn,ct,`${(0.013 * baseNum(doughs[0],2)).toFixed(2)} lb.`);
      doc.text(pageMargin,ct += tableToNextTitle,`Yeast`);
      doc.text(pageMargin + nextColumn,ct,`${(0.002 * baseNum(doughs[0],2)).toFixed(2)} lb.`);    

  }

  if (doughs[0].bucketSets>4) {
    
    doc.text(pageMargin,ct += tableToNextTitle,`Baguette Mix #2`);
    doc.setFontSize(14);
    doc.text(pageMargin,ct += tableToNextTitle,`Bucket Sets`);
    doc.text(pageMargin + nextColumn,ct,`${doughs[0].bucketSets} (L and P)`);
    doc.text(pageMargin,ct += tableToNextTitle,`Old Dough`);
    doc.text(pageMargin + nextColumn,ct,`${doughs[0].oldDough} lb.`);
    doc.text(pageMargin,ct += tableToNextTitle,`50 lb. Bread Flour`);
    doc.text(pageMargin + nextColumn,ct,`${Math.floor((0.575 * baseNum(doughs[0],3)) / 50)}`);
    doc.text(pageMargin,ct += tableToNextTitle,`25 lb. Bucket Water`);
    doc.text(pageMargin + nextColumn,ct,`${Math.floor((0.372 * baseNum(doughs[0],3)) / 25)}`);
    doc.text(pageMargin,ct += tableToNextTitle,`Bread Flour`);
    doc.text(pageMargin + nextColumn,ct,`${((0.575 * baseNum(doughs[0],3)) % 50).toFixed(2)} lb.`);
    doc.text(pageMargin,ct += tableToNextTitle,`Whole Wheat Flour`);
    doc.text(pageMargin + nextColumn,ct,`${(0.038 * baseNum(doughs[0],3)).toFixed(2)} lb.`);
    doc.text(pageMargin,ct += tableToNextTitle,`Water`);
    doc.text(pageMargin + nextColumn,ct,`${((0.372 * baseNum(doughs[0],3)) % 25).toFixed(2)} lb.`);
    doc.text(pageMargin,ct += tableToNextTitle,`Salt`);
    doc.text(pageMargin + nextColumn,ct,`${(0.013 * baseNum(doughs[0],2)).toFixed(2)} lb.`);
    doc.text(pageMargin,ct += tableToNextTitle,`Yeast`);
    doc.text(pageMargin + nextColumn,ct,`${(0.002 * baseNum(doughs[0],2)).toFixed(2)} lb.`);    

}
    
    doc.save(`BaguetteMix${today}.pdf`);
  };

  const baseNum = (dough,mixNum) => {
    let divider
    switch (Number(dough.bucketSets)) {
      case 3:
        if (mixNum===1){
          divider = .666
        } else {
          divider = .333
        }
        break;
      case 4:
        divider = 2
        break;
      case 5:
        if (mixNum===1 || mixNum===2){
          divider = .666
        } else {
          divider = .333
        }
        break;
      case 6:
        divider = 3
        break;
      default:
        divider = 1
    }


    return (Number(dough.buffer) + Number(dough.needed) - Number(dough.oldDough))/divider;
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
          Print Baguette Mix
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      
      <WholeBox>
      
        <h1>BPBN Baguette Mix</h1>
        <div>{header}</div>
        {doughs.map((dough) => (
          <React.Fragment key={dough.id + "_firstFrag"}>
            <h3>
              {dough.doughName}: (need {dough.needed} lb.) TOTAL:
              {Number(
                Number(dough.needed) +
                  Number(dough.buffer) +
                  Number(dough.short)
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
              <div>{dough.bucketSets} (L and P)</div>
              <div>Old Dough</div>
              <div>{dough.oldDough} lb.</div>
              <div>50 lb. Bread Flour</div>
              <div>{Math.floor((0.575 * baseNum(dough,1)) / 50)}</div>
              <div>25 lb. Bucket Water</div>
              <div>{Math.floor((0.372 * baseNum(dough,1)) / 25)}</div>
              <div> </div>
              <div> </div>
              <div>Bread Flour</div>
              <div>{((0.575 * baseNum(dough,1)) % 50).toFixed(2)} lb.</div>
              <div>Whole Wheat Flour</div>
              <div>{(0.038 * baseNum(dough,1)).toFixed(2)} lb.</div>
              <div>Water</div>
              <div>{((0.372 * baseNum(dough,1)) % 25).toFixed(2)} lb.</div>
              <div>Salt</div>
              <div>{(0.013 * baseNum(dough,1)).toFixed(2)} lb.</div>
              <div>Yeast</div>
              <div>{(0.002 * baseNum(dough,1)).toFixed(2)} lb.</div>
            </TwoColumnGrid>

            {dough.bucketSets > 2 && (
              <React.Fragment>
                <h2>Baguette Mix #2</h2>
                <TwoColumnGrid>
                  <div>Bucket Sets</div>
                  <div>{dough.bucketSets} (L and P)</div>
                  <div>Old Dough</div>
                  <div>{dough.oldDough} lb.</div>
                  <div>50 lb. Bread Flour</div>
                  <div>{Math.floor((0.575 * baseNum(dough,2)) / 50)}</div>
                  <div>25 lb. Bucket Water</div>
                  <div>{Math.floor((0.372 * baseNum(dough,2)) / 25)}</div>
                  <div> </div>
                  <div> </div>
                  <div>Bread Flour</div>
                  <div>{((0.575 * baseNum(dough,2)) % 50).toFixed(2)} lb.</div>
                  <div>Whole Wheat Flour</div>
                  <div>{(0.038 * baseNum(dough,2)).toFixed(2)} lb.</div>
                  <div>Water</div>
                  <div>{((0.372 * baseNum(dough,2)) % 25).toFixed(2)} lb.</div>
                  <div>Salt</div>
                  <div>{(0.013 * baseNum(dough,2)).toFixed(2)} lb.</div>
                  <div>Yeast</div>
                  <div>{(0.002 * baseNum(dough)).toFixed(2)} lb.</div>
                </TwoColumnGrid>
              </React.Fragment>
            )}
            {dough.bucketSets > 4 && (
              <React.Fragment>
                <h2>Baguette Mix #3</h2>
                <TwoColumnGrid>
                  <div>Bucket Sets</div>
                  <div>{dough.bucketSets} (L and P)</div>
                  <div>Old Dough</div>
                  <div>{dough.oldDough} lb.</div>
                  <div>50 lb. Bread Flour</div>
                  <div>{Math.floor((0.575 * baseNum(dough,3)) / 50)}</div>
                  <div>25 lb. Bucket Water</div>
                  <div>{Math.floor((0.372 * baseNum(dough,3)) / 25)}</div>
                  <div> </div>
                  <div> </div>
                  <div>Bread Flour</div>
                  <div>{((0.575 * baseNum(dough,3)) % 50).toFixed(2)} lb.</div>
                  <div>Whole Wheat Flour</div>
                  <div>{(0.038 * baseNum(dough,3)).toFixed(2)} lb.</div>
                  <div>Water</div>
                  <div>{((0.372 * baseNum(dough,3)) % 25).toFixed(2)} lb.</div>
                  <div>Salt</div>
                  <div>{(0.013 * baseNum(dough,3)).toFixed(2)} lb.</div>
                  <div>Yeast</div>
                  <div>{(0.002 * baseNum(dough,3)).toFixed(2)} lb.</div>
                </TwoColumnGrid>
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNBaker1Dough;
