import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex,addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch, FilterDupsByIndex } from '../helpers/useFetch'

import { ProgressSpinner } from 'primereact/progressspinner';

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
            let currentData = FilterDupsByIndex(data,1)
            sortAtoZDataByIndex(currentData,2)
            let newData = addAnEmptyRowToTop(currentData)
            setProducts(newData);
        }   
    },[data, setProducts]);

    return (
        <React.Fragment>
            { loading && <div className = "Loader"><div className = "loaderBack"><ProgressSpinner/></div></div>}
            { error && <p> error while loading products!</p>}
        </React.Fragment>
    )
    
};