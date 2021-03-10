import React, { useState, createContext, useContext, useEffect } from 'react';

import { listProducts } from '../graphql/queries'

import { API, graphqlOperation } from 'aws-amplify';

import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'




export const ProductsContext = createContext();

export const ProductsProvider = (props) => {

    const [products, setProducts] = useState([]);
    const [ prodLoaded, setProdLoaded ] = useState(false)
    
    
    return (
        <ProductsContext.Provider value={{ 
            products, setProducts, 
            prodLoaded, setProdLoaded
            }}>
            {props.children}
        </ProductsContext.Provider>
    );   
    
};


export const ProductsLoad = () => {

    const { setProducts, setProdLoaded } = useContext(ProductsContext)

    useEffect(() => {
        fetchProducts()
      },[])


    const fetchProducts = async () => {
        try{
          const prodData = await API.graphql(graphqlOperation(listProducts, {limit: '500'}))
          const prodList = prodData.data.listProducts.items;
          sortAtoZDataByIndex(prodList,"prodName")
          setProducts(prodList)
          setProdLoaded(true)
        } catch (error){
          console.log('error on fetching Product List', error)
        }
      }
  

    return (
        <React.Fragment>
        </React.Fragment>
    )
    
};

