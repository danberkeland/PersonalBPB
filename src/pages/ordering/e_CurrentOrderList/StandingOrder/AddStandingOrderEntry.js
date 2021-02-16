import React, { useState, useContext, useEffect, useRef } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../../dataContexts/StandingContext';
import { HoldingContext } from '../../../../dataContexts/HoldingContext';
import { ProductsContext } from '../../../../dataContexts/ProductsContext'
import { ToggleContext } from '../../../../dataContexts/ToggleContext';

import { findAvailableProducts } from '../../../../helpers/sortDataHelpers';


const clonedeep = require('lodash.clonedeep')


const AddCartEntryItem = () => {

    const { products } = useContext(ProductsContext)
    const { standing, setStanding } = useContext(StandingContext)
    const { holding, setHolding } = useContext(HoldingContext)
    const { orders } = useContext(OrdersContext)
    const { chosen, delivDate } = useContext(CurrentDataContext)
    const { standList, setModifications } = useContext(ToggleContext)

    const [ pickedProduct, setPickedProduct ] = useState();
    const [ productList, setProductList ] = useState();
    
   let standHold =useRef();

    useEffect(() => { 
        standList ? standHold.current = "MAKE H.O." : standHold.current = "MAKE S.O."
    },[standList])

    useEffect(() => {
        let availableProducts = findAvailableProducts(products, orders, chosen, delivDate)
        setProductList(availableProducts)
        },[products, orders, chosen, delivDate ]);


    const handleChange = e => {
        setPickedProduct(e.target.value)

    } 

    const handleAdd = () => {
        let newStandingList = clonedeep(standing)
        if (pickedProduct !=="" && pickedProduct){
            for (let i=1; i<8; i++){
                let newOrder =[i.toString(),"na","0","na","na","na","na",pickedProduct,chosen] 
                newStandingList.push(newOrder)
            }
        }
        setStanding(newStandingList)
        setModifications(true)
        setPickedProduct('');
    }

    const handleStandHold = async () => {
        let currentStandList = await clonedeep(standing)
        let currentHoldList = await clonedeep(holding)

        let standID = clonedeep(standList)

        if(standID){
            let currentStandListClip = currentStandList.filter(stand => stand[8] === chosen)
            let clipToManipulate = clonedeep(currentStandListClip)
            let timeStamp = new Date().toISOString()
            let zeroCurrentStand = clipToManipulate.map(stand => 
                [stand[0],"na","0","na",timeStamp,"na","na",stand[7],stand[8]])
            let reducedStandList = await currentStandList.filter(stand => stand[8] !== chosen)
            let sendStand = reducedStandList.concat(zeroCurrentStand)
            let sendHold = currentHoldList.concat(currentStandListClip)
            setStanding(sendStand)
            setHolding(sendHold)
        } else {
            let currentHoldListClip = await currentHoldList.filter(hold => hold[8] === chosen)
            let clipToManipulate = clonedeep(currentHoldListClip)
            let timeStamp = new Date().toISOString()
            let zeroCurrentHold = Array.from(clipToManipulate, stand => 
                [stand[0],"na","0","na",timeStamp,"na","na",stand[7],stand[8]])
            let reducedHoldList = await currentHoldList.filter(hold => hold[8] !== chosen)
            let sendHold = reducedHoldList.concat(zeroCurrentHold)
            let sendStand = currentStandList.concat(currentHoldListClip)
            setHolding(sendHold)
            setStanding(sendStand)
            
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
            <button style={standList ? so : ho } onClick={handleStandHold}>{standHold.current}</button>
        </div>
    );
};

export default AddCartEntryItem