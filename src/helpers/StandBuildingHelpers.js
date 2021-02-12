import { convertDatetoBPBDate, convertDatetoStandingDate } from '../helpers/dateTimeHelpers'
import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'

import swal from '@sweetalert/with-react';

const clonedeep = require('lodash.clonedeep')


export const checkStandHoldStatus = (standing,holding,chosen) => {

    let Stand = false
    let Hold = false
    let standingToCheck = clonedeep(standing)
    let holdingToCheck = clonedeep(holding)
    // check for standing, if no, check for holding, if no return
    
    for (let stand in standingToCheck){
        if (standingToCheck[stand][8] === chosen){
            Stand = true
        }
    }
    for (let hold in holdingToCheck){
        if (holdingToCheck[hold][8] === chosen){
            Hold = true
        }
    }
    return [Stand,Hold]
}


export const createStandListArray = (standing, holding, Stand, Hold, chosen) => {
    
    let buildStandArray = []
    if (Stand){
        let pullStand = clonedeep(standing)
        for (let pull of pullStand){
            // search index of item in buildArray
            if (pull[8] === chosen){
                let ind = buildStandArray.findIndex(stand => stand[0] === pull[7])
                if (ind>=0){
                    buildStandArray[ind][Number(pull[0])] = pull[2]
                } else {
                    let newStand = [pull[7],"0","0","0","0","0","0","0"]
                    newStand[Number(pull[0])] = pull[2]
                    buildStandArray.push(newStand)
                }
            }
        } 
    }   
    if (Hold){
        let pullHold = clonedeep(holding)
        for (let pull of pullHold){
            // search index of item in buildArray
            if (pull[8] === chosen){
                let ind = buildStandArray.findIndex(stand => stand[0] === pull[7])
                if (ind>=0){
                    buildStandArray[ind][Number(pull[0])] = pull[2]
                } else {
                    let newStand = [pull[7],"0","0","0","0","0","0","0"]
                    newStand[Number(pull[0])] = pull[2]
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
        let ind = updatedStandorHold.findIndex(stand => stand[0] === i.toString() && stand[7] === indexToFind && stand[8] === chosen)
        if (ind>=0){
            updatedStandorHold[ind][2] = "0";
        }
    }
    updatedStandorHold = updatedStandorHold.filter(stand => stand[2] !=="0")
    return updatedStandorHold
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
    let intTarg = e.target.id
    intTarg = intTarg.split('_')
    let updatedStanding = clonedeep(updatedStandorHold)
    let ind = updatedStanding.findIndex(stand => stand[0] === intTarg[1] 
        && stand[7] === indexToFind && stand[8] === chosen)
    if(ind>=0){
        updatedStanding[ind][2] = newQty
    }
    return updatedStanding
}