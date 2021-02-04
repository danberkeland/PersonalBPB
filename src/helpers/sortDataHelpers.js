
import { convertDatetoBPBDate, convertDatetoStandingDate } from './dateTimeHelpers'


export const sortAtoZDataByIndex = (data,index) => {
    data.sort(function(a,b){return a[index]>b[index] ? 1 : -1;})
}


export const convertSheetsOrdersToAppOrders = (data) => {
    let convertedOrderList = data.map(order => [ order[2],
                                            order[7],
                                            order[8],
                                            order[4],
                                            order[6],
                                            order[2], 
                                            order[3] !== "9999" ? true : false,
                                            order[0],
                                            
    ])
    return convertedOrderList
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

export const FindNewRoute = (chosen, delivDate, orders, customers) => {
    let newRoute
    let currentRoutes = orders.filter(order => order[2] === chosen && order[7] === convertDatetoBPBDate(delivDate) );
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


export const createCartList = (chosen, delivDate, orders) => {
    let BPBDate = convertDatetoBPBDate(delivDate)
    let filteredOrders = [...orders]
    let cartList = filteredOrders ? filteredOrders.filter(order => order[7] === BPBDate && order[2] === chosen) : [];
    return cartList
}


export const createStandingList = (chosen, delivDate, standing) => {
    let standingDate = convertDatetoStandingDate(delivDate);  
    let filteredStanding = [...standing] 
    let standingList = filteredStanding ? filteredStanding.filter(standing => standing[0] === standingDate && standing[8] === chosen) : [];
    let convertedOrderList = standingList.map(order => [ order[2],
        order[7],
        order[8],
        'na',
        order[6],
        order[2], 
        order[3] !== "9999" ? true : false,
        standingDate
])
    return convertedOrderList

}


export const createCurrentOrderList = (cartList, standingList) => {

    let orderList = cartList.concat(standingList)
    for (let i=0; i<orderList.length; ++i ){
        for (let j=i+1; j<orderList.length; ++j){
            if (orderList[i][1] === orderList[j][1]){
                orderList.splice(j,1);
            }
        }
    }

    return orderList
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
    let chosen = newOrder[2]
    let prodToAdd = newOrder[1]
    let qty = newOrder[0]
    let prodIndex = orders.findIndex(order => 
        order[1] === prodToAdd && 
        order[2] === chosen && 
        order[7] === convertDatetoBPBDate(delivDate))
    if(prodIndex >= 0){
        newOrderList[prodIndex][0] = qty
    } else {

        newOrderList.push(newOrder)
    }
    return newOrderList
}