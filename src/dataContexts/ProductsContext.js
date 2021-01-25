import React, { useState, createContext, useEffect } from 'react';


export const ProductsContext = createContext();


export const ProductProvider = (props) => {

    const [products, setProduct] = useState([]);

    useEffect(() => {
        const apiUrl = "https://z86xl2km85.execute-api.us-east-2.amazonaws.com/done";
        fetch(apiUrl)
        .then(res => res.json())
        .then(data => setProduct(data.body.sort(function(a,b){return a[1]>b[1] ? 1 : -1;})));
        
    },[])

    return (
        <ProductsContext.Provider value={[products, setProduct]}>
            {props.children}
        </ProductsContext.Provider>
    );   
    
};