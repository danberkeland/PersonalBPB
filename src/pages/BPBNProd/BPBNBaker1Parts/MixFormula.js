import { getMixInfo } from './GetMixInfo'

export const mixFormula = (doughs, infoWrap, multi) => {
    //  Set up Mix 1
  
    let [dough, multiple, stickerAmount, bucketSets, mixes, info] = getMixInfo(
      doughs,
      infoWrap
    );
     stickerAmount = (
      Number(dough.needed) +
      Number(dough.buffer) +
      Number(dough.short)
    ).toFixed(2);
    
    let Mix1BucketSets = Math.round(dough.bucketSets * multiple[multi]);
    
    let Mix1OldDough = (dough.oldDough * multiple[multi]).toFixed(2);
    let Mix150lbFlour = Math.floor(
      (0.5731 * ((stickerAmount-dough.oldDough) * multiple[multi]) - (Mix1BucketSets * 19.22)) / 50
    );
    let Mix125lbWater = Math.floor(
      (0.3721 * ((stickerAmount-dough.oldDough) * multiple[multi]) - (Mix1BucketSets * 19.22)) / 25
    );
    let Mix1BreadFlour = (
      (0.5731 * ((stickerAmount-dough.oldDough) * multiple[multi]) - (Mix1BucketSets * 19.22)) % 50
    ).toFixed(2);
    let Mix1WholeWheat = (0.038 * (stickerAmount-dough.oldDough) * multiple[multi]).toFixed(2);
    let Mix1Water = (
      ((0.3721 * (stickerAmount-dough.oldDough) - bucketSets * 19.22) * multiple[multi]) %
      25
    ).toFixed(2);
    let Mix1Salt = (0.013 * (stickerAmount-dough.oldDough) * multiple[multi]).toFixed(2);
    let Mix1Yeast = (0.002 * (stickerAmount-dough.oldDough) * multiple[multi]).toFixed(2);
  
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