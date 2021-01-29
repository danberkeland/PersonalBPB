import React, { useState, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CustDateRecentContext } from '../../../dataContexts/CustDateRecentContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { ProductsContext } from '../../../dataContexts/ProductsContext'


const AddCartEntryItem = () => {

    const { products, pickedProduct, setPickedProduct } = useContext(ProductsContext)
    const { thisOrder, setThisOrder } = useContext(OrdersContext)
    const { chosen } = useContext(CustDateRecentContext)

    
    const [ productList, setProductList ] = useState();
    

    useEffect(() => {
        let availableProducts = [...products]
        for (let prod of thisOrder) {
            let prodPull = prod[0]==="0" ? '' : prod[1]
            availableProducts = availableProducts.filter(availProd => availProd[1] !== prodPull)
        }
        availableProducts.unshift(['','','','','','','','','','','','','','','','','','','']);
        setProductList(availableProducts)
        },[products, pickedProduct, thisOrder, setPickedProduct]);


    const handleChange = e => {
        setPickedProduct(e.target.value)

    } 

    const handleAdd = () => {
        let qty = document.getElementById("addedProdQty").value
        let newOrder =[qty, pickedProduct, chosen]
        let newOrderList = [...thisOrder]
        let prodToAdd = pickedProduct
        let prodIndex = thisOrder.findIndex(order => order[1] === prodToAdd)
        if(prodIndex >= 0){
            newOrderList[prodIndex][0] = qty
        } else {
            newOrderList = [newOrder, ...thisOrder]
        }
        console.log(newOrderList)
        
        setThisOrder(newOrderList)
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