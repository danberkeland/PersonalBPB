import React, { useContext, useEffect } from 'react';


import { ProgressSpinner } from 'primereact/progressspinner';
import { ToggleContext } from './dataContexts/ToggleContext';
import { CustomerContext } from './dataContexts/CustomerContext';
import { OrdersContext } from './dataContexts/OrdersContext';
import { ProductsContext } from './dataContexts/ProductsContext';
import { StandingContext } from './dataContexts/StandingContext';
import { HoldingContext } from './dataContexts/HoldingContext';



const Loader = () => {

    let { isLoading, setIsLoading } = useContext(ToggleContext)
    let { custLoaded } = useContext(CustomerContext)
    let { ordersLoaded } = useContext(OrdersContext)
    let { prodLoaded } = useContext(ProductsContext)
    let { standLoaded } = useContext(StandingContext)
    let { holdLoaded } = useContext(HoldingContext)


    useEffect(() => {

        if (custLoaded === true &&
            ordersLoaded === true &&
            prodLoaded === true &&
            standLoaded === true &&
            holdLoaded === true){
                setIsLoading(false)
            } else {
                setIsLoading(true)
            }

    })
    

    return (
        <React.Fragment>
            {isLoading ? <div className = "Loader"><div className = "loaderBack"><ProgressSpinner/></div></div> :''}
        </React.Fragment>
    )
    
};

export default Loader

