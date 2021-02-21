
import { convertDatetoBPBDate, convertDatetoStandingDate } from '../helpers/dateTimeHelpers'
import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'

const clonedeep = require('lodash.clonedeep')


export const buildCartList = (chosen,delivDate,orders) => {
    let BPBDate = convertDatetoBPBDate(delivDate)
    let filteredOrders = clonedeep(orders)
    let builtCartList = []
    if (filteredOrders.length>=0){
        builtCartList = filteredOrders.filter(order => order[7] === BPBDate && order[2].match(`${chosen}`))
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
    sortAtoZDataByIndex(orderList,1)
    return orderList
}


export const buildCurrentOrder = (chosen,delivDate,orders,standing) => {
    let cartList = buildCartList(chosen,delivDate,orders)
    let standList = buildStandList(chosen, delivDate, standing)
    let currentOrderList = compileOrderList(cartList,standList)
    return currentOrderList
}


export const filterOutZeros = (currentOrderList) => {
    let filteredZeros = currentOrderList.filter(order => (Number(order[5])+Number(order[0])>0))
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


export const setCurrentCartLineToQty = (e,currentCartList,qty) => {
    let newQty = qty
    let indexToFind = e.target.name
    let foundPresentedIndex = currentCartList.findIndex(line => line[1] === indexToFind)
    let presentedListToModify = [...currentCartList]
    presentedListToModify[foundPresentedIndex][0] = newQty
    return presentedListToModify
}


export const updateCurrentLineInOrdersWithQty = (e,chosen, delivDate, orders, ponote, route, isWhole, qty) => {
    let newQty = qty
    let indexToFind = e.target.name
    let oldValue = e.target.dataset.qty
    let updatedOrders = clonedeep(orders)
    let foundOrdersIndex = updatedOrders.findIndex(line => line[1] === indexToFind &&
        line[2] === chosen && line[7] === convertDatetoBPBDate(delivDate))
    if(foundOrdersIndex>=0){
        updatedOrders[foundOrdersIndex][0] = newQty
    } else {
        let orderToAdd = [newQty,indexToFind,chosen, ponote, route, oldValue, isWhole, convertDatetoBPBDate(delivDate)]
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



