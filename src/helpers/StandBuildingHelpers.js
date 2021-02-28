
const clonedeep = require('lodash.clonedeep')


export const checkStandHoldStatus = (standing,holding,chosen) => {

    let Stand = false
    let Hold = false
    let standingToCheck = clonedeep(standing)
    let holdingToCheck = clonedeep(holding)
    // check for standing, if no, check for holding, if no return
    
    let standingToCount = standingToCheck.filter(stand => stand["custName"] === chosen.name)
    if (standingToCount.length>0){
        standingToCount = standingToCount.map(stand => Number(stand["qty"]))
        let sum = standingToCount.reduce((a,b) => {
            return a + b;
        },0);
        if (sum>0){
            Stand = true
        }
    }

    let holdingToCount = holdingToCheck.filter(hold => hold["custName"] === chosen)
    if (holdingToCount.length>0){
        holdingToCount = holdingToCount.map(hold => Number(hold["qty"]))
        let sum = holdingToCount.reduce((a,b) => {
            return a + b;
        },0);
        if (sum>0){
            Hold = true
        }
    }


   
   

    return [Stand,Hold]
}


export const createStandListArray = (standing, holding, Stand, Hold, chosen) => {
    
    let buildStandArray = []
    if (Stand){
        console.log("here")
        let pullStand = clonedeep(standing)
        for (let pull of pullStand){
            // search index of item in buildArray
            if (pull["custName"] === chosen.name){
                let ind = buildStandArray.findIndex(stand => stand[0] === pull["prodName"])
                if (ind>=0){
                    buildStandArray[ind][Number(pull["dayNum"])] = pull["qty"]
                } else {
                    let newStand = [pull["prodName"],"0","0","0","0","0","0","0"]
                    newStand[Number(pull["dayNum"])] = pull["qty"]
                    buildStandArray.push(newStand)
                }
            }
        } 
    }   
    if (Hold){
        console.log("nope here")
        let pullHold = clonedeep(holding)
        for (let pull of pullHold){
            // search index of item in buildArray
            if (pull["custName"] === chosen.name){
                let ind = buildStandArray.findIndex(stand => stand[0] === pull["prodName"])
                if (ind>=0){
                    buildStandArray[ind][Number(pull["dayNum"])] = pull["qty"]
                } else {
                    let newStand = [pull["prodName"],"0","0","0","0","0","0","0"]
                    newStand[Number(pull["dayNum"])] = pull["qty"]
                    buildStandArray.push(newStand)
                }
            }
        } 
    }   
    return buildStandArray
}


export const clearSelectedStandItem = (e,standArray) => {
    let indexToFind = e.target.name
    let foundStandIndex = standArray.findIndex(line => line[0] === indexToFind)
    let standListToModify = clonedeep(standArray)
    for (let i = 1; i<8; ++i){
        standListToModify[foundStandIndex][i] = "0";
    }
    return standListToModify
}


export const createUpdateWeeklyList = (e, updatedStandorHold, chosen) => {
    let indexToFind = e.target.name
    for (let i = 1; i<8; ++i){
        let ind = updatedStandorHold.findIndex(stand => stand["dayNum"] === i.toString() && 
            stand["prodName"] === indexToFind && stand["custName"] === chosen.name)
        if (ind>=0){
            updatedStandorHold[ind]["qty"] = "0";
        } 
    updatedStandorHold = updatedStandorHold.filter(stand => stand["qty"] !=="0")
    return updatedStandorHold
    }
}

export const setCurrentStandLineToQty = (e,standArray) => {
    let newQty = e.target.value
    let indexToFind = e.target.name
    let foundStandIndex = standArray.findIndex(line => line[0] === indexToFind)
    let StandListToModify = clonedeep(standArray)
    let intTarg = e.target.id
    intTarg = intTarg.split('_')
    StandListToModify[foundStandIndex][intTarg[1]] = newQty;
    return StandListToModify
}


export const createUpdateWeeklyStandList = (e, updatedStandorHold, chosen) => {
    let newQty = e.target.value
    let indexToFind = e.target.name
    let timeStamp = new Date().toISOString()
    let intTarg = e.target.id
    intTarg = intTarg.split('_')
    let updatedStanding = clonedeep(updatedStandorHold)
    let ind = updatedStanding.findIndex(stand => stand["dayNum"] === intTarg[1] 
        && stand["prodName"] === indexToFind && stand["custName"] === chosen.name)
    if(ind>=0){
        updatedStanding[ind]["qty"] = newQty
    } else {
        let newStand = {
            "dayNum":e.target.dataset.day,
            "qty": e.target.value,
            "timeStamp": timeStamp.toString(),
            "prodName": e.target.name,
            "custName": chosen.name
        }
        updatedStanding.push(newStand)
    }

    return updatedStanding
}