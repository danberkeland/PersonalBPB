import React from 'react';

import BuildCurrentStandingList from './BuildCurrentStandingList'


const StandingOrderEntry = () => {

    return (
        <React.Fragment> 
            <label>PRODUCT</label>
            <label>S</label>
            <label>M</label>
            <label>T</label>
            <label>W</label>
            <label>T</label>
            <label>F</label>
            <label>S</label>
            <label></label>
            <BuildCurrentStandingList />

        </React.Fragment>
        
    )
};

export default StandingOrderEntry