import React, { useState, createContext, useContext, useEffect } from 'react';

import { useFetch,handleLoadingError } from '../helpers/useFetch'


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

    const { data } = useFetch(process.env.REACT_APP_API_PRODUCTS,[]);

    const { setProducts, setProdLoaded } = useContext(ProductsContext)

    useEffect(() => { 
        if(data){
            if(data.length>0){
                setProducts(data);
                setProdLoaded(true)
            }
        } else {
            handleLoadingError()
        }
    },[data]);
    
    
    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};