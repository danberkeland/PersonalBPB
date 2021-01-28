import React, { useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CustDateRecentContext } from '../../../dataContexts/CustDateRecentContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { ProductsContext } from '../../../dataContexts/ProductsContext'

import { convertDatetoBPBDate } from '../../../helpers/dateTimeHelpers'

const AddCartEntryItem = () => {

    const { products } = useContext(ProductsContext)
    const { orders, setOrders } = useContext(OrdersContext)
    const { delivDate, chosen } = useContext(CustDateRecentContext)

    const [ pickedProduct, setPickedProduct ] = useState();
    const [ productList, setProductList ] = useState();
    

    useEffect(() => {
        setProductList(products)

    },[products]);

    const handleChange = e => {
        setPickedProduct(e.target.value)

    } 

    // THIS IS NOT FINISHED!!!  NEED TO FILL IN THE NAS ON NEW ORDER!!!
    const handleAdd = () => {
        let qty = document.getElementById("addedProdQty").value
        let BPBDate = convertDatetoBPBDate(delivDate)
        let newOrder = [BPBDate, "na", qty, "na", "na", "na", "na", pickedProduct, chosen]
        let newOrderList = [newOrder, ...orders]
        setOrders(newOrderList)
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
            <input type="text" id="addedProdQty" placeholder="0"></input>
            <button onClick={handleAdd}>ADD</button>
        </div>
    );
};

export default AddCartEntryItem