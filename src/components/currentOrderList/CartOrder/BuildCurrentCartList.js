import React, { useContext, useEffect, useState } from 'react';

import swal from '@sweetalert/with-react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';

import { convertDatetoBPBDate, convertDatetoStandingDate } from '../../../helpers/dateTimeHelpers'

const clonedeep = require('lodash.clonedeep')



const buildCartList = (chosen,delivDate,orders) => {
    let BPBDate = convertDatetoBPBDate(delivDate)
    let filteredOrders = clonedeep(orders)
    let builtCartList = []
    if (filteredOrders.length>=0){
        builtCartList = filteredOrders.filter(order => order[7] === BPBDate && order[2] === chosen)
    }
    return builtCartList 
}

const buildStandList = (chosen,delivDate,standing) => {
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

const compileOrderList = (cartList,standList) => {
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

const filterOutZeros = (currentOrderList) => {
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

const BuildCurrentCartList = () => {

    const { orders, setOrders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { chosen, delivDate } = useContext(CurrentDataContext)

    const [ currentList, setCurrentList ] = useState([])


    useEffect(() => {

        let cartList = buildCartList(chosen,delivDate,orders)
        let standList = buildStandList(chosen, delivDate, standing)
        let currentOrderList = compileOrderList(cartList,standList)
        let noZerosOrderList = filterOutZeros(currentOrderList)
        setCurrentList(noZerosOrderList)
    }, [chosen, delivDate, orders, setOrders, standing])

    const handleRemove = e => {}

    const handleQtyModify = e => {}

    return (
        <React.Fragment>
        {currentList.map(order => 
            <React.Fragment key={order[1]+"b"}>
                <button 
                    className="trashButton"
                    onClick={e => {handleRemove(e)}} 
                    key={order[1]+"e"} 
                    name={order[1]}
                    id={order[1]}>🗑️</button>
                <label key={order[1]}>{order[1]}</label>   
                <input  
                    type="text" 
                    size="4"
                    maxLength="5"
                    key={order[1]+"c"} 
                    id={order[1]+"item"} 
                    name={order[1]} 
                    placeholder={order[0]} 
                    onKeyUp={e => {handleQtyModify(e)}}
                    onBlur={(e) => {

                        e.target.value = ''

                    }}
                        >
                </input>
                <label 
                    key={order[1]+"d"} 
                    className="previous">{order[5] === order[0] ? '' : order[5]}
                </label>

            </React.Fragment>
        )}
        </React.Fragment>
    );
};

export default BuildCurrentCartList