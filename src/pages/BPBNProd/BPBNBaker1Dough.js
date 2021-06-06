import React, { useEffect, useContext } from "react";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { promisedData } from "../../helpers/databaseFetchers";
import ComposeDough from "./BPBNSetOutUtils/composeDough";
import { todayPlus } from "../../helpers/dateTimeHelpers";

import { updateDough } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

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

const clonedeep = require("lodash.clonedeep");
const compose = new ComposeDough();

function BPBNBaker1Dough({
  doughs,
  setDoughs,
  doughComponents,
  setDoughComponents,
  bagAndEpiCount,
  setBagAndEpiCount,
  oliveCount,
  setOliveCount,
  bcCount,
  setBcCount,
  bagDoughTwoDays,
  setBagDoughTwoDays,
  setTitleInfo,
  setMix1Info,
}) {
  const { setIsLoading } = useContext(ToggleContext);

  let tomorrow = todayPlus()[1];

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

  const doughMixList = (dough) => {
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

    // set up Title Info

    let doughName = dough.doughName;
    let doughNeeded = dough.needed;
    let doughTotal =
      Number(dough.needed) + Number(dough.buffer) + Number(dough.short);
    let doughShort = Number(dough.short);

    //  Set up Mix 1

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
      { title: "Bucket Sets", amount: Mix1BucketSets + " (L and P)" },
      { title: "Old Dough", amount: Mix1OldDough + " lb." },
      { title: "50 lb. Bread Flour", amount: Mix150lbFlour },
      { title: "25 lb. Bucket Water", amount: Mix125lbWater },
      { title: "Bread Flour", amount: Mix1BreadFlour + " lb." },
      { title: "Whole Wheat Flour", amount: Mix1WholeWheat + " lb." },
      { title: "Water", amount: Mix1Water + " lb." },
      { title: "Salt", amount: Mix1Salt + " lb." },
      { title: "Yeast", amount: Mix1Yeast + " lb." },
    ];

    //  Set up Mix 2

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
      { title: "Bucket Sets", amount: Mix2BucketSets + " (L and P)" },
      { title: "Old Dough", amount: Mix2OldDough + " lb." },
      { title: "50 lb. Bread Flour", amount: Mix250lbFlour },
      { title: "25 lb. Bucket Water", amount: Mix225lbWater },
      { title: "Bread Flour", amount: Mix2BreadFlour + " lb." },
      { title: "Whole Wheat Flour", amount: Mix2WholeWheat + " lb." },
      { title: "Water", amount: Mix2Water + " lb." },
      { title: "Salt", amount: Mix2Salt + " lb." },
      { title: "Yeast", amount: Mix2Yeast + " lb." },
    ];

    //  Set up Mix 3

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
      { title: "Bucket Sets", amount: Mix3BucketSets + " (L and P)" },
      { title: "Old Dough", amount: Mix3OldDough + " lb." },
      { title: "50 lb. Bread Flour", amount: Mix350lbFlour },
      { title: "25 lb. Bucket Water", amount: Mix325lbWater },
      { title: "Bread Flour", amount: Mix3BreadFlour + " lb." },
      { title: "Whole Wheat Flour", amount: Mix3WholeWheat + " lb." },
      { title: "Water", amount: Mix3Water + " lb." },
      { title: "Salt", amount: Mix3Salt + " lb." },
      { title: "Yeast", amount: Mix3Yeast + " lb." },
    ];


    return (
      <React.Fragment key={dough.id + "_firstFrag"}>
        <h3>
          {doughName}: (need {doughNeeded} lb.) TOTAL:
          {doughTotal} SHORT: {doughShort}
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
        <DataTable value={mix1Info} className="p-datatable-sm">
          <Column field="title" header="Ingredient"></Column>
          <Column field="amount" header="Amount"></Column>
        </DataTable>

        {mixes > 1 && (
          <React.Fragment>
            <h2>Baguette Mix #2</h2>
            <DataTable value={mix2Info} className="p-datatable-sm">
              <Column field="title" header="Ingredient"></Column>
              <Column field="amount" header="Amount"></Column>
            </DataTable>
          </React.Fragment>
        )}
        {mixes > 2 && (
          <React.Fragment>
            <h2>Baguette Mix #3</h2>
            <DataTable value={mix3Info} className="p-datatable-sm">
              <Column field="title" header="Ingredient"></Column>
              <Column field="amount" header="Amount"></Column>
            </DataTable>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <WholeBox>
        <h1>BPBN Baguette Mix</h1>
        {doughs[0] && doughMixList(doughs[0])}

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
