import { getMixInfo } from './GetMixInfo'

export const bucketAmount = (doughs, infoWrap) => {
   
    let bucketSets = getMixInfo(doughs, infoWrap)[5].bucketSets;
  
    return [
      { title: "Bucket Sets", amount: bucketSets },
      
    ];
  };