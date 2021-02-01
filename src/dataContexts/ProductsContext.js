import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex,addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch } from '../helpers/useFetch'

require('dotenv').config()

export const ProductsContext = createContext();


export const ProductsProvider = (props) => {

    const [products, setProducts] = useState([]);

    return (
        <ProductsContext.Provider value={{ products, setProducts }}>
            {props.children}
        </ProductsContext.Provider>
    );   
    
};


export const ProductsLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_PRODUCTS,[]);

    const { setProducts } = useContext(ProductsContext)

    useEffect(() => {
        if (data){
        sortAtoZDataByIndex(data,1)
        let newData = addAnEmptyRowToTop(data)
        setProducts(newData);
        }   
    },[data, setProducts]);

    return (
        <React.Fragment>
            { loading && <p>Loading Products ...</p>}
            { error && <p> error while loading products!</p>}
        </React.Fragment>
    )
    
};