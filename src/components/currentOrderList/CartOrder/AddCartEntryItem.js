import React, { useState, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { ProductsContext } from '../../../dataContexts/ProductsContext'

import { convertDatetoBPBDate } from '../../../helpers/dateTimeHelpers';
import { findAvailableProducts,decideWhetherToAddOrModify } from '../../../helpers/sortDataHelpers';




const AddCartEntryItem = () => {

    const { products } = useContext(ProductsContext)
    const { orders, setOrders } = useContext(OrdersContext)
    const { chosen, delivDate, orderTypeWhole, route, ponote } = useContext(CurrentDataContext)

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
        let newOrder =[qty, pickedProduct, chosen, ponote, route, qty, orderTypeWhole, convertDatetoBPBDate(delivDate)] 
        let newOrderList = decideWhetherToAddOrModify(orders, newOrder, delivDate)
        setOrders(newOrderList)
        document.getElementById("addedProdQty").value = '';
        setPickedProduct('');
    }

    return (
        <div className="addAProductToCart">
            <select id = "products" name="products" value={pickedProduct} onChange={handleChange}>
            {
                productList ? productList.map((product) => 
                    <option key = {uuidv4()} value={product[1]}>{product[1]}</option>
                ) : ''
                }; 
            </select>
            <input type="text" id="addedProdQty"></input>
            <button onClick={handleAdd}>ADD</button>
        </div>
    );
};

export default AddCartEntryItem