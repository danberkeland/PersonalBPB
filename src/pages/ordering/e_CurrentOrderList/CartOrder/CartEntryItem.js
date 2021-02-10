import React from 'react';

import BuildCurrentCartList from './BuildCurrentCartList'


const CartEntryItem = () => {

    return (
        <React.Fragment> 
            <label></label>
            <label>PRODUCT</label>
            <label>QTY</label>
            <label>PREV</label>
            <BuildCurrentCartList />
            
            
        </React.Fragment>
        
    )
};

export default CartEntryItem