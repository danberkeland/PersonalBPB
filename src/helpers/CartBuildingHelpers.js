
import { convertDatetoBPBDate, convertDatetoStandingDate } from '../helpers/dateTimeHelpers'

const clonedeep = require('lodash.clonedeep')


export const buildCartList = (chosen,delivDate,orders) => {
    let BPBDate = convertDatetoBPBDate(delivDate)
    let filteredOrders = clonedeep(orders)
    let builtCartList = []
    if (filteredOrders.length>=0){
        builtCartList = filteredOrders.filter(order => order[7] === BPBDate && order[2] === chosen)
    }
    return builtCartList 
}


export const buildStandList = (chosen,delivDate,standing) => {
    let standingDate = convertDatetoStandingDate(delivDate);  
    let filteredStanding = clonedeep(standing)
    let builtStandList =[]
    if (filteredStanding.length>=0){
        builtStandList = filteredStanding.filter(standing => standing[0] === standingDate && standing[8] === chosen)
    }
    let convertedStandList = convertStandListtoStandArray(builtStandList, delivDate)
   
    return convertedStandList
}


const convertStandListtoStandArray = (builtStandList, delivDate) => {
    let convertedStandList = builtStandList.map(order => [    
        order[2],
        order[7],
        order[8],
        'na',
        order[6],
        order[2], 
        order[3] !== "9999" ? true : false,
        convertDatetoBPBDate(delivDate)])
    return convertedStandList
}


export const compileOrderList = (cartList,standList) => {
    let orderList = cartList.concat(standList)

    // Remove old cart order from orders if it exists
    for (let i=0; i<orderList.length; ++i ){
        for (let j=i+1; j<orderList.length; ++j){
            if (orderList[i][1] === orderList[j][1]){
                orderList.splice(j,1);
            }
        }
    }
    return orderList
}


export const filterOutZeros = (currentOrderList) => {
    let filteredZeros = currentOrderList.filter(order => order[0] !== "0" && order[5] !== "0")
    return filteredZeros
}



/*
const makeSureRouteIsCorrect = (orderList, route) => {
    if (orderList.length>0) {
        for (let order in orderList){
            console.log(orderList[order])
            orderList[order][4] = route
        }
        return orderList
        
    } else {
        swal ({
            text: "Need to enter a product first",
            icon: "warning",
            buttons: false,
            timer: 2000
          })
        return
    }
}


const makeSurePONoteIsCorrect = (orderList, ponote) => {
    if (orderList.length>0) {
        for (let order in orderList){
            orderList[order][3] = ponote
        }
        return orderList
        
    } else {
        swal ({
            text: "Need to enter a product first",
            icon: "warning",
            buttons: false,
            timer: 2000
          })
        return
    }
}

const rebuildOrderList = (currentOrderList, orders) => {
    let recent = clonedeep(orders)
        let newOrderList = currentOrderList.concat(recent)
            for (let i=0; i<newOrderList.length; ++i ){
                for (let j=i+1; j<newOrderList.length; ++j){
                    if (  newOrderList[i][1] === newOrderList[j][1] &&
                          newOrderList[i][2] === newOrderList[j][2] &&
                          newOrderList[i][7] === newOrderList[j][7]){
                        newOrderList.splice(j,1);
                    }
                }
              }
    return newOrderList    
}

*/