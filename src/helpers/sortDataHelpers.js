
import { convertDatetoBPBDate } from './dateTimeHelpers'
import { buildCartList, buildStandList, compileOrderList } from './CartBuildingHelpers'

import { cloneDeep } from 'lodash';



export const sortAtoZDataByIndex = (data,index) => {
    data.sort(function(a,b){return a[index]>b[index] ? 1 : -1;})
    return data
}

export const sortZtoADataByIndex = (data,index) => {
    data.sort(function(a,b){return a[index]<b[index] ? 1 : -1;})
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
    let special = orders.filter(order => order["isWhole"] === false)
    special = special.map(order => ({"custName":order["custName"]}))
    let unique = [...new Set(special.map(spec => spec.custName))]
    unique = unique.map(uni => ({"name": uni}))
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
    /*
    if (orders){
        for (let order of orders) {
            let prodPull = order["qty"]==="0" && order["custName"] === chosen && 
            order["delivDate"] === convertDatetoBPBDate(delivDate) ? order["prodName"] : ''
            availableProducts = availableProducts.filter(availProd => availProd["name"] !== prodPull)
        }
    }
    */
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
            if (  orderData[i]["qty"] === originalOrderData[j]["qty"] &&
                orderData[i]["prodName"] === originalOrderData[j]["prodName"] &&
                orderData[i]["custName"] === originalOrderData[j]["custName"] &&
                orderData[i]["PONote"] === originalOrderData[j]["PONote"] &&
                orderData[i]["route"] === originalOrderData[j]["route"] &&
                orderData[i]["delivDate"] === originalOrderData[j]["delivDate"] 
                ){
                    orderData.splice(i,1);
                }
            }
        }

    let timeStamp = new Date()
    let timeStampedData = orderData.map(order => ({
        qty: order["SO"],
        prodName: order["prodName"],
        custName: order["custName"],
        PONote: order["PONote"],
        route: order["route"],
        SO: order["SO"],
        isWhole: order["isWhole"],
        delivDate: order["delivDate"],
        timeStamp: timeStamp
    }))
    return timeStampedData
}


export const createStandHoldClip = (orders, originalOrders) => {
    let orderData = cloneDeep(orders)
    let originalOrderData = cloneDeep(originalOrders)
    
    for (let i=0; i<orderData.length; ++i ){
        for (let j=0; j<originalOrderData.length; ++j){
            if (  orderData[i]["dayNum"] === originalOrderData[j]["dayNum"] &&
                orderData[i]["qty"] === originalOrderData[j]["qty"] &&
                orderData[i]["prodName"] === originalOrderData[j]["prodName"] &&
                orderData[i]["custName"] === originalOrderData[j]["custName"] 
                ){
                    orderData.splice(i,1);
                }
            }
        }

    let timeStamp = new Date()
    let timeStampedData = orderData.map(order => ({
        dayNum: Number(order["dayNum"]),
        qty: Number(order["qty"]),
        SO: Number(order["qty"]),
        timeStamp: timeStamp,
        prodName: order["prodName"],
        custName: order["custName"]
    }))
    return timeStampedData
}