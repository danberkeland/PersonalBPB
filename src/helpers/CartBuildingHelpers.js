
import { convertDatetoBPBDate, convertDatetoStandingDate } from '../helpers/dateTimeHelpers'
import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'

import { wildcardRegExp } from 'wildcard-regex'

const clonedeep = require('lodash.clonedeep')


export const buildCartList = (chosen,delivDate,orders) => {
    let BPBDate = convertDatetoBPBDate(delivDate)
    let filteredOrders = clonedeep(orders)
    let builtCartList = []
    if (filteredOrders){
        builtCartList = filteredOrders.filter(order => order["delivDate"] === BPBDate && order["custName"].match(wildcardRegExp(`${chosen}`)))
    }
    return builtCartList 
}


export const buildStandList = (chosen,delivDate,standing) => {
    let standingDate = convertDatetoStandingDate(delivDate);  
    let filteredStanding = clonedeep(standing)
    let builtStandList =[]
    builtStandList = filteredStanding.filter(standing => standing["dayNum"] === standingDate && standing["custName"].match(wildcardRegExp(`${chosen}`)) )
    let convertedStandList = convertStandListtoStandArray(builtStandList, delivDate)
    return convertedStandList
}


const convertStandListtoStandArray = (builtStandList, delivDate) => {
    let convertedStandList = builtStandList.map(order => ({   
        "qty": order["qty"],
        "prodName": order["prodName"],
        "custName": order["custName"],
        "PONote": "na",
        "route": order["route"],
        "isWhole": true,
        "delivDate": convertDatetoBPBDate(delivDate),
        "timeStamp": order["timeStamp"],
        "SO": order["qty"]
    }))
    return convertedStandList
}


export const compileOrderList = (cartList,standList) => {
    let orderList = cartList.concat(standList)

    // Remove old cart order from orders if it exists
    for (let i=0; i<orderList.length; ++i ){
        for (let j=i+1; j<orderList.length; ++j){
            if (orderList[i]["prodName"] === orderList[j]["prodName"]){
                orderList.splice(j,1);
            }
        }
    }
    sortAtoZDataByIndex(orderList,"prodName")
    return orderList
}


export const buildCurrentOrder = (chosen,delivDate,orders,standing) => {
    let cartList = buildCartList(chosen,delivDate,orders)
    let standList = buildStandList(chosen, delivDate, standing)
    let currentOrderList = compileOrderList(cartList,standList)
    
    return currentOrderList
}


export const filterOutZeros = (currentOrderList) => {
    console.log(currentOrderList)
    let filteredZeros = currentOrderList.filter(order => ((Number(order["qty"])+Number(order["SO"]))>0))
    return filteredZeros
}


export const addNewInfoToOrders = (currentOrderList, orders) => {
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


export const setCurrentCartLineToQty = (prodName,currentCartList,qty) => {
    let newQty = qty
    let indexToFind = prodName
   
    let foundPresentedIndex = currentCartList.findIndex(line => line["prodName"] === indexToFind)
    let presentedListToModify = clonedeep(currentCartList)
   
    presentedListToModify[foundPresentedIndex]["qty"] = newQty
    return presentedListToModify
}


export const updateCurrentLineInOrdersWithQty = (prodName ,chosen, delivDate, orders, ponote, route, isWhole, qty, SO) => {

    let updatedOrders = clonedeep(orders)
    let foundOrdersIndex = updatedOrders.findIndex(line => line["prodName"] === prodName &&
        line["custName"] === chosen.name && line["delivDate"] === convertDatetoBPBDate(delivDate))
    if(foundOrdersIndex>=0){
        updatedOrders[foundOrdersIndex]["qty"] = qty.toString()
    } else {
        let orderToAdd = {
            "qty": qty.toString(),
            "prodName": prodName,
            "custName": chosen.name, 
            "PONote": ponote, 
            "route": route, 
            "SO": SO, 
            "isWhole": isWhole, 
            "delivDate": convertDatetoBPBDate(delivDate)}
        updatedOrders.push(orderToAdd)
    }
    return updatedOrders
}


export const testEntryForProduct = (entry) => {
    return /\d+\s\w+/g.test(entry)
}

export const createArrayofEnteredProducts = (entry) => {
    const array = [...entry.matchAll(/\d+\s\w+/g)];
    let enteredProducts = array.map(item => item[0].split(" "))
    return enteredProducts
}

export const createOrdersToUpdate = (products, enteredProducts, chosen, ponote, route, orderTypeWhole, delivDate) => {
    let ordersToUpdate = [];
    for (let product of products){
      for (let enteredItem of enteredProducts){
        if (product[2] === enteredItem[1]){
          let newOrder = [enteredItem[0],product[1], chosen, ponote, route, "0", orderTypeWhole, convertDatetoBPBDate(delivDate)] // [ qty, prod, cust, po, route, so, ty ]
          ordersToUpdate.push(newOrder)
        }
      }
    }
    return ordersToUpdate
}


export const buildOrdersToModify = (orders, chosen, delivDate, ordersToUpdate, custOrderList) => {
    let ordersToModify = [...orders]
    for (let orderToUpdate of ordersToUpdate){
      for (let custOrder of custOrderList){
        if (orderToUpdate[1] === custOrder[1]){
        
          let index = ordersToModify.findIndex(order => order[1] === custOrder[1] &&
                order[2] === chosen && order[7] === convertDatetoBPBDate(delivDate));
          if (index>=0){
            ordersToModify[index][0] = orderToUpdate[0] 
                 
          } else{
            orderToUpdate[5] = custOrder[5]
            ordersToModify.push(orderToUpdate)
            
          }
        }
      }    
    }
    return ordersToModify
}

export const addUpdatesToOrders = (chosen, delivDate, ordersToUpdate, ordersToModify) => {
    for (let ord of ordersToUpdate){
        
        let index = ordersToModify.findIndex(order => order[1] === ord[1] &&
          order[2] === chosen && order[7] === convertDatetoBPBDate(delivDate));
        if (index<0){
          ordersToModify.push(ord)
        
      }
    }  
    return ordersToModify  
}



