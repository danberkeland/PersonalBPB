import { getMixInfo } from './GetMixInfo'

export const binInfo = (doughs, infoWrap) => {
    console.log(infoWrap)
   
    let baguetteBins = getMixInfo(doughs, infoWrap)[5].baguetteBins;
    let oliveWeight = getMixInfo(doughs, infoWrap)[5].oliveWeight;
    let bcWeight = getMixInfo(doughs, infoWrap)[5].bcWeight;
  
    return [
      { title: "Baguette (27.7)", amount: baguetteBins+" bins" },
      { title: "Olive", amount: oliveWeight+" lb." },
      { title: "BC Walnut", amount: bcWeight+" lb." },
    ];
  };