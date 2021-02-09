import React, { useState, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { HoldingContext } from '../../../dataContexts/HoldingContext';
import { ProductsContext } from '../../../dataContexts/ProductsContext'

import { convertDatetoBPBDate } from '../../../helpers/dateTimeHelpers';
import { findAvailableProducts,decideWhetherToAddOrModify } from '../../../helpers/sortDataHelpers';

const clonedeep = require('lodash.clonedeep')


const AddCartEntryItem = () => {

    const { products } = useContext(ProductsContext)
    const { standing, setStanding } = useContext(StandingContext)
    const { holding, setHolding } = useContext(HoldingContext)
    const { orders, setOrders, standList, setStandList } = useContext(OrdersContext)
    const { chosen, delivDate, orderTypeWhole, route, ponote } = useContext(CurrentDataContext)

    const [ pickedProduct, setPickedProduct ] = useState();
    const [ productList, setProductList ] = useState();
    
    let standHold 
    standList ? standHold = "MAKE H.O." : standHold = "MAKE S.O."

    useEffect(() => {
        let availableProducts = findAvailableProducts(products, orders, chosen, delivDate)
        setProductList(availableProducts)
        },[products, orders, chosen, delivDate ]);


    const handleChange = e => {
        setPickedProduct(e.target.value)

    } 

    const handleAdd = () => {
        let newStandingList = clonedeep(standing)
        for (let i=1; i<8; i++){
            let newOrder =[i.toString(),"na","0","na","na","na","na",pickedProduct,chosen] 
            newStandingList.push(newOrder)
        }
        
        setStanding(newStandingList)
        setPickedProduct('');
    }

    const handleStandHold = async () => {
        let currentStandList = await clonedeep(standing)
        let currentHoldList = await clonedeep(holding)

        if(standList){
            let currentStandListClip = await currentStandList.filter(stand => stand[8] === chosen)
            let reducedStandList = await currentStandList.filter(stand => stand[8] !== chosen)
            let send = currentHoldList.concat(currentStandListClip)
            setStanding(await reducedStandList)
            setHolding(send)
        } else {
            let currentHoldListClip = currentHoldList.filter(hold => hold[8] === chosen)
            let reducedHoldList = currentHoldList.filter(hold => hold[8] !== chosen)
            let send = currentStandList.concat(currentHoldListClip)
            setHolding(reducedHoldList)
            setStanding(send)
            
        }
    }

    const ho = {
        backgroundColor: "red"
      }

      const so = {
        backgroundColor: "green"
      }


    return (
        <div className="addAProductToStanding">
            <select id = "products" name="products" value={pickedProduct} onChange={handleChange} disabled={chosen ? false : true}>
            {
                productList ? productList.map((product) => 
                    <option key = {uuidv4()} value={product[1]}>{product[1]}</option>
                ) : ''
                }; 
            </select>
           
            <button onClick={handleAdd}>ADD</button>
            <button style={standList ? so : ho } onClick={handleStandHold}>{standHold}</button>
        </div>
    );
};

export default AddCartEntryItem