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




const AddCartEntryItem = () => {

    const AddProductButtons = styled.div`
        display: flex;
        width: 100%;
        margin: 20px 0;
        justify-content: space-around;
        background-color: lightgrey;
        padding: 10px 0;
        `


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
    const { orderTypeWhole }= useContext(ToggleContext)

    const [ pickedProduct, setPickedProduct ] = useState();
    const [ productList, setProductList ] = useState();
    

    useEffect(() => {
        let availableProducts = findAvailableProducts(products, orders, chosen, delivDate)
        setProductList(availableProducts)
        },[products, orders, chosen, delivDate ]);


    const handleChange = e => {
        setPickedProduct(e.target.value)

    } 

    const handleAdd = () => {
        let qty = document.getElementById("addedProdQty").value
        let newOrder =[qty, pickedProduct, chosen, ponote, route, "0", orderTypeWhole, convertDatetoBPBDate(delivDate)] 
        let newOrderList = decideWhetherToAddOrModify(orders, newOrder, delivDate)
        setOrders(newOrderList)
        document.getElementById("addedProdQty").value = '';
        setPickedProduct('');
    }

    

    return (
        <AddProductButtons>
            <Dropdown options={cities} optionLabel="name" placeholder="Select a product"/>
            <span className="p-float-label">
                <InputText id="qty" size="10"/>
                <label htmlhtmlFor="qty">Quantity</label>
            </span>
            <Button label="ADD" icon="pi pi-plus"/>
        </AddProductButtons>
    );
};

export default AddCartEntryItem