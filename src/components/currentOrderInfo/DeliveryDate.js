import React, { useContext } from 'react';
import { CustDateRecentContext } from '../../dataContexts/CustDateRecentContext';


export const DeliveryDate = () => {

    const { delivDate } = useContext(CustDateRecentContext)

    return (
        <React.Fragment>
            <label>Delivery Date:</label>
            <input type="text" id="deliveryDate" name="deliveryDate" value={delivDate} readOnly></input>
        </React.Fragment>
    );
};


