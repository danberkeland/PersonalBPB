import React, { useState, createContext, useContext, useEffect } from 'react';

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


const useFetch = url => {
    const [state, setState] = useState({
        loading: true,
        error: false,
        data: [],
    });

    useEffect(() => {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then(data => setState({loading: false, error: false, data: data.body }))
            .catch(error => setState({ loading: false, error, data: [] }));
    }, [url]);

    return state;
};




export const ProductsLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_PRODUCTS,[]);

    const { setProducts } = useContext(ProductsContext)

    useEffect(() => {
        data.sort(function(a,b){return a[1]>b[1] ? 1 : -1;})
        setProducts(data);
    });

    return (
        <React.Fragment>
            { loading && <p>Loading Products ...</p>}
            { error && <p> error while loading products!</p>}
        </React.Fragment>
    )
    
};

