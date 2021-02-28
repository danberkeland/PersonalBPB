import React, { useContext } from 'react';


import { ProgressSpinner } from 'primereact/progressspinner';
import { ToggleContext } from './dataContexts/ToggleContext';
import { CustomerContext } from './dataContexts/CustomerContext';
import { OrdersContext } from './dataContexts/OrdersContext';
import { ProductsContext } from './dataContexts/ProductsContext';
import { StandingContext } from './dataContexts/StandingContext';
import { HoldingContext } from './dataContexts/HoldingContext';

import styled from 'styled-components'

const LoaderSetup = styled.div`
    width: 100%;
    margin: 45vh 45%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    `

const LoaderBack = styled.div`
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 199;
    background-color:rgba(65, 64, 99, .5);
    `

const Loader = () => {

    let { isLoading } = useContext(ToggleContext)
    
    return (
        
            <React.Fragment>
                {isLoading ? <LoaderBack><LoaderSetup><ProgressSpinner/></LoaderSetup></LoaderBack> :''}
            </React.Fragment>
        
    )
    
};

export default Loader

