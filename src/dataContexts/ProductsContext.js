import React, { useState, createContext, useContext, useEffect } from 'react';

import { sortAtoZDataByIndex,addAnEmptyRowToTop } from '../helpers/sortDataHelpers'
import { useFetch, FilterDupsByIndex } from '../helpers/useFetch'

import { ProgressSpinner } from 'primereact/progressspinner';

require('dotenv').config()

export const ProductsContext = createContext();


export const ProductsProvider = (props) => {

    const [products, setProducts] = useState([]);
    const [ prodLoaded, setProdLoaded ] = useState(false)

    return (
        <ProductsContext.Provider value={{ products, setProducts, prodLoaded, setProdLoaded }}>
            {props.children}
        </ProductsContext.Provider>
    );   
    
};


export const ProductsLoad = () => {

    const { loading, data } = useFetch(process.env.REACT_APP_API_PRODUCTS,[]);

    const { setProducts, setProdLoaded } = useContext(ProductsContext)

    useEffect(() => {
        if (data){
            let currentData = FilterDupsByIndex(data,1)
            sortAtoZDataByIndex(currentData,2)
            let newData = addAnEmptyRowToTop(currentData)
            setProducts(newData);
        }   
    },[data, setProducts]);


    useEffect(() => {
        setProdLoaded(!loading)
    },[loading, setProdLoaded])
    
    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};