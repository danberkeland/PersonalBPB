import React, { useState, useContext, useEffect, useRef } from 'react';


import { CurrentDataContext } from '../../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../../dataContexts/StandingContext';
import { HoldingContext } from '../../../../dataContexts/HoldingContext';
import { ProductsContext } from '../../../../dataContexts/ProductsContext'
import { ToggleContext } from '../../../../dataContexts/ToggleContext';

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

import { findAvailableProducts } from '../../../../helpers/sortDataHelpers';

import styled from 'styled-components'

const AddProductButtons = styled.div`
        display: flex;
        width: 100%;
        margin: 20px 0;
        justify-content: space-around;
        background-color: lightgrey;
        padding: 10px 0;
        `

const clonedeep = require('lodash.clonedeep')


const AddCartEntryItem = () => {

    const { products } = useContext(ProductsContext)
    const { standing, setStanding } = useContext(StandingContext)
    const { holding, setHolding } = useContext(HoldingContext)
    const { orders } = useContext(OrdersContext)
    const { chosen, delivDate } = useContext(CurrentDataContext)
    const { standList } = useContext(ToggleContext)

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
        setPickedProduct(e.target.value.name)

    } 

    const handleAdd = () => {
        let newStandingList = clonedeep(standing)
        if (pickedProduct !=="" && pickedProduct){
            for (let i=1; i<8; i++){
                let newOrder =({
                    "dayNum": i.toString(),
                    "qty": "0",
                    "SO": "0",
                    "prodName": pickedProduct,
                    "custName": chosen
                }) 
                newStandingList.push(newOrder)
            }
        }
        setStanding(newStandingList)
        
        setPickedProduct('');
    }

    const handleStandHold = async () => {
        let currentStandList = await clonedeep(standing)
        let currentHoldList = await clonedeep(holding)

        let standID = clonedeep(standList)

        if(standID){
            let currentStandListClip = currentStandList.filter(stand => stand["custName"] === chosen)
            let clipToManipulate = clonedeep(currentStandListClip)
            let timeStamp = new Date().toISOString()
            let zeroCurrentStand = clipToManipulate.map(stand => 
                ({
                    "dayNum": stand["dayNum"],
                    "qty": "0",
                    "SO": "0",
                    "timeStamp": timeStamp,
                    "prodName": stand["prodName"],
                    "custName": stand["custName"]})
            )
            let reducedStandList = await currentStandList.filter(stand => stand["custName"] !== chosen)
            let sendStand = reducedStandList.concat(zeroCurrentStand)
            let sendHold = currentHoldList.concat(currentStandListClip)
            setStanding(sendStand)
            setHolding(sendHold)
        } else {
            let currentHoldListClip = await currentHoldList.filter(hold => hold["custName"] === chosen)
            let clipToManipulate = clonedeep(currentHoldListClip)
            let timeStamp = new Date().toISOString()
            let zeroCurrentHold = Array.from(clipToManipulate, stand => 
                ({
                    "dayNum": stand["dayNum"],
                    "qty": "0",
                    "SO": "0",
                    "timeStamp": timeStamp,
                    "prodName": stand["prodName"],
                    "custName": stand["custName"]})
            )
            let reducedHoldList = await currentHoldList.filter(hold => hold["custName"] !== chosen)
            let sendHold = reducedHoldList.concat(zeroCurrentHold)
            let sendStand = currentStandList.concat(currentHoldListClip)
            setHolding(sendHold)
            setStanding(sendStand)
            
        }
    }

    return (

        <AddProductButtons>

            <Dropdown options={productList} optionLabel="name" 
                placeholder={pickedProduct==='' ? "Select a Product ..." : pickedProduct }
                value={pickedProduct} 
                onChange={handleChange} disabled={chosen!=='  ' ? false : true}/>
            <Button label="ADD" disabled={chosen==='  ' || pickedProduct===''} icon="pi pi-plus" onClick={handleAdd}/>
        
            <Button className={!standList ? "p-button-raised p-button-rounded p-button-danger" : "p-button-raised p-button-rounded p-button-success"} 
                onClick={handleStandHold} label={standHold.current}/>
        </AddProductButtons>
    );
};

export default AddCartEntryItem