import React, { useState, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../../dataContexts/OrdersContext';
import { ProductsContext } from '../../../../dataContexts/ProductsContext'
import { ToggleContext } from '../../../../dataContexts/ToggleContext';

import { convertDatetoBPBDate } from '../../../../helpers/dateTimeHelpers';
import { findAvailableProducts,decideWhetherToAddOrModify } from '../../../../helpers/sortDataHelpers';

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';


import styled from 'styled-components'

const AddProductButtons = styled.div`
        display: flex;
        width: 100%;
        margin: 20px 0;
        justify-content: space-around;
        background-color: lightgrey;
        padding: 10px 0;
        `





const AddCartEntryItem = () => {

    const cities = [
        {name: 'New York', code: 'NY'},
        {name: 'Rome', code: 'RM'},
        {name: 'London', code: 'LDN'},
        {name: 'Istanbul', code: 'IST'},
        {name: 'Paris', code: 'PRS'}
        ];
    

    const { products } = useContext(ProductsContext)
    const { orders, setOrders } = useContext(OrdersContext)
    const { chosen, delivDate, route, ponote } = useContext(CurrentDataContext)
    const { orderTypeWhole, setModifications }= useContext(ToggleContext)

    const [ pickedProduct, setPickedProduct ] = useState();
    const [ productList, setProductList ] = useState();
    

    useEffect(() => {
        let availableProducts = findAvailableProducts(products, orders, chosen.name, delivDate)
        setProductList(availableProducts)
        },[products, orders, chosen, delivDate ]);


    const handleChange = e => {
        setPickedProduct(e.target.value)

    } 

    const handleAdd = () => {
        let qty = document.getElementById("addedProdQty").value
       
        let newOrder ={
            "qty": qty, 
            "prodName": pickedProduct.name,
            "custName": chosen.name, 
            "PONote": ponote, 
            "route": route, 
            "SO": "0", 
            "isWhole": orderTypeWhole, 
            "delivDate": convertDatetoBPBDate(delivDate)
        }
        let newOrderList = decideWhetherToAddOrModify(orders, newOrder, delivDate)
        setOrders(newOrderList)
        document.getElementById("addedProdQty").value = '';
        setPickedProduct('');
        
    }

    

    return (
        <AddProductButtons>
            <Dropdown options={products} optionLabel="name" placeholder="Select a product"
                name="products" value={pickedProduct} onChange={handleChange} disabled={chosen!=='  ' ? false : true}/>
            <span className="p-float-label">
                <InputText id="addedProdQty" size="10" disabled={chosen!=='  ' ? false : true}/>
                <label htmlFor="qty">Quantity</label>
            </span>
            <Button label="ADD" disabled={chosen==='  ' || pickedProduct===''} icon="pi pi-plus" onClick={() => handleAdd()}/>
        </AddProductButtons>
    );
};

export default AddCartEntryItem