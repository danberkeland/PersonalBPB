
import { convertDatetoBPBDate, convertDatetoStandingDate } from './dateTimeHelpers'


export const sortAtoZDataByIndex = (data,index) => {
    data.sort(function(a,b){return a[index]>b[index] ? 1 : -1;})
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

export const createRouteList = customers => {
    let routesArray = [...customers]
    routesArray = routesArray.map(cust => cust[3])
    const uniqueRoutesSet = new Set(routesArray)
    const newRoutesArray = Array.from(uniqueRoutesSet)
    return newRoutesArray
}

export const FindNewRoute = (chosen, delivDate, thisOrder, customers) => {
    let newRoute
    let currentRoutes = thisOrder.filter(order => order[2] === chosen && convertDatetoBPBDate(order[0]) === delivDate );
    let custRoute = customers.find(element => element[2] === chosen)
    custRoute ? newRoute = custRoute[3] : newRoute = "Pick up Carlton"
    if (currentRoutes.length>0) {
        newRoute = currentRoutes[0][4]
    }
    return newRoute
}


export const createCartList = (chosen, delivDate, orders) => {
    let BPBDate = convertDatetoBPBDate(delivDate)
    let cartList = orders ? orders.filter(order => order[0] === BPBDate && order[8] === chosen)
                            .map(order => [ order[2],
                                            order[7],
                                            order[8],
                                            order[4],
                                            order[6],
                                            order[2], 
                                            order[3] !== "9999" ? true : false]
                                            ) : [];
    return cartList
}


export const createStandingList = (chosen, delivDate, standing) => {
    let standingDate = convertDatetoStandingDate(delivDate);   
    let standingList = standing ? standing.filter(standing => standing[0] === standingDate && standing[8] === chosen)
    .map(order => [ order[2],
                    order[7],
                    order[8],
                    order[4],
                    order[6],
                    order[2],
                    order[3] !== "9999" ? true : false]
                
                    ) : [];
    return standingList

}


export const createCurrentOrderList = (cartList, standingList) => {
    let orderList;
    if (cartList.length>0){
        orderList = cartList;
    } else if (standingList.length>0){
        orderList = standingList;
    } else {
        orderList = []
    }
    return orderList
}