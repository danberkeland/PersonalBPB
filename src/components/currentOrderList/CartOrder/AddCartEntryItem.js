import React, { useState, useContext, useEffect } from 'react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { ProductsContext } from '../../../dataContexts/ProductsContext'


const AddCartEntryItem = () => {

    const { products } = useContext(ProductsContext)
    const { orders, setOrders } = useContext(OrdersContext)
    const { chosen, orderTypeWhole, route, ponote } = useContext(CurrentDataContext)

    const [ pickedProduct, setPickedProduct ] = useState();
    const [ productlist, setProductList ] = useState();
    

    useEffect(() => {
        let availableProducts = [...products]
        for (let prod of orders) {
            let prodPull = prod[0]==="0" ? '' : prod[1]
            availableProducts = availableProducts.filter(availProd => availProd[1] !== prodPull)
        }
        availableProducts.unshift(['','','','','','','','','','','','','','','','','','','']);
        setProductList(availableProducts)
        },[products, pickedProduct, orders, setPickedProduct]);


    const handleChange = e => {
        setPickedProduct(e.target.value)

    } 

    const handleAdd = () => {
        let qty = document.getElementById("addedProdQty").value
        let newOrder =[qty, pickedProduct, chosen, ponote, route, qty, orderTypeWhole] // [ qty, prod, cust, po, route, so, type ]
        let newOrderList = [...orders]
        let prodToAdd = pickedProduct
        let prodIndex = orders.findIndex(order => order[1] === prodToAdd)
        if(prodIndex >= 0){
            newOrderList[prodIndex][0] = qty
        } else {
            newOrderList = [newOrder, ...orders]
        }
        
        setOrders(newOrderList)
        document.getElementById("addedProdQty").value = '';
        setPickedProduct('');
    }

    return (
        <div className="addAProductToCart">
            <select id = "products" name="products" value={pickedProduct} onChange={handleChange}>
            {/* } {
                productList ? productList.map((product) => 
                    <option key = {uuidv4()} value={product[1]}>{product[1]}</option>
                ) : ''
                }; */}
            </select>
            <input type="text" id="addedProdQty"></input>
            <button onClick={handleAdd}>ADD</button>
        </div>
    );
};

export default AddCartEntryItem