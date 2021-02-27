
import { convertDatetoBPBDate } from './dateTimeHelpers'
import { buildCartList, buildStandList, compileOrderList } from './CartBuildingHelpers'

import { cloneDeep } from 'lodash';
import { DayCellContent } from '@fullcalendar/react';



export const sortAtoZDataByIndex = (data,index) => {
    data.sort(function(a,b){return a[index]>b[index] ? 1 : -1;})
    return data
}

export const sortZtoADataByIndex = (data,index) => {
    data.sort(function(a,b){return a[index]>b[index] ? -1 : 1;})
    return data
}



export const addAnEmptyRowToTop = (data) => {
    let len = data.length;
    let newArray = [];
    for (let i=0; i<len; i++){
        newArray.push('')
        }
    data.unshift(newArray);
    return data
}

export const createRetailOrderCustomers = orders => {
    let special = orders.filter(order => order[6] === false)
    special = special.map(order => ["","",order[2],""])
    let unique = special.map(ar => JSON.stringify(ar))
        .filter((itm, idx, arr) => arr.indexOf(itm) === idx)
        .map(str => JSON.parse(str))
    if (unique[0] !== ['','','','']){
        unique.unshift(['','','',''])
    }
    return unique
}


export const createRouteList = customers => {
    let routesArray = [...customers]
    routesArray = routesArray.map(cust => cust[3])
    const uniqueRoutesSet = new Set(routesArray)
    const newRoutesArray = Array.from(uniqueRoutesSet)
    return newRoutesArray
}

export const findNewRoute = (chosen, delivDate, standing, orders, customers) => {
    let newRoute
    let cartList = buildCartList(chosen,delivDate,orders)
    let standList = buildStandList(chosen, delivDate, standing)
    let currentOrderList = compileOrderList(cartList,standList)
    let currentRoutes = currentOrderList.filter(order => order[2] === chosen && order[7] === convertDatetoBPBDate(delivDate) );
    let custRoute = customers.find(element => element[2] === chosen)
    custRoute ? newRoute = custRoute[3] : newRoute = "Pick up Carlton"
    if (currentRoutes.length>0) {
        newRoute = currentRoutes[0][4]
    }
    return newRoute
}


export const findCurrentPonote =(chosen, delivDate, orders) => {
    let po
    let currentOrders = orders.filter(order => order[2] === chosen && order[7] === convertDatetoBPBDate(delivDate) );
    if (currentOrders.length>0) {
        po = currentOrders[0][3]
    } else {
        po = "na"
    }
    return po
}


export const findAvailableProducts = (products, orders, chosen, delivDate) => {
    let availableProducts = [...products]
    for (let prod of orders) {
        let prodPull = prod[0]==="0" && prod[2] === chosen && 
        prod[7] === convertDatetoBPBDate(delivDate) ? prod[1] : ''
        availableProducts = availableProducts.filter(availProd => availProd[1] !== prodPull)
    }
    availableProducts.unshift(['','','','','','','','','','','','','','','','','','','']);
    return availableProducts
}

export const decideWhetherToAddOrModify = (orders, newOrder, delivDate) => {
    let newOrderList = [...orders]
    let chosen = newOrder["custName"]
    let prodToAdd = newOrder["prodName"]
    let qty = newOrder["qty"]
    let prodIndex = newOrderList.findIndex(order => 
        order["prodName"] === prodToAdd && 
        order["custName"] === chosen && 
        order["delivDate"] === convertDatetoBPBDate(delivDate))
    if(prodIndex >= 0){
        newOrderList[prodIndex]["qty"] = qty
    } else {

        newOrderList.push(newOrder)
    }
    return newOrderList
}


export const createOrderUpdatesClip = (orders, originalOrders) => {
    let orderData = cloneDeep(orders)
    let originalOrderData = cloneDeep(originalOrders)
    
    for (let i=0; i<orderData.length; ++i ){
        for (let j=0; j<originalOrderData.length; ++j){
            if (  orderData[i][0] === originalOrderData[j][0] &&
                orderData[i][1] === originalOrderData[j][1] &&
                orderData[i][2] === originalOrderData[j][2] &&
                orderData[i][3] === originalOrderData[j][3] &&
                orderData[i][4] === originalOrderData[j][4] &&
                orderData[i][7] === originalOrderData[j][7] 
                ){
                    orderData.splice(i,1);
                }
            }
        }

    let timeStamp = new Date()
    let timeStampedData = orderData.map(order => [order[5],order[1],order[2],order[3],order[4],order[5],order[6],order[7],timeStamp])
    return timeStampedData
}


export const createStandHoldClip = (orders, originalOrders) => {
    let orderData = cloneDeep(orders)
    let originalOrderData = cloneDeep(originalOrders)
    
    for (let i=0; i<orderData.length; ++i ){
        for (let j=0; j<originalOrderData.length; ++j){
            if (  orderData[i][0] === originalOrderData[j][0] &&
                orderData[i][2] === originalOrderData[j][2] &&
                orderData[i][7] === originalOrderData[j][7] &&
                orderData[i][8] === originalOrderData[j][8] 
                ){
                    orderData.splice(i,1);
                }
            }
        }

    let timeStamp = new Date()
    let timeStampedData = orderData.map(order => [order[0],order[1],order[2],order[3],timeStamp,order[5],order[6],order[7],order[8]])
    return timeStampedData
}