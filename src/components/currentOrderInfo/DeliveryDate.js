import React, { useContext } from 'react';
import { CurrentOrderContext } from '../../dataContexts/CurrentOrderContext';


export const DeliveryDate = () => {

    const { delivDate } = useContext(CurrentOrderContext)

    return (
        <React.Fragment>
            <label>Delivery Date:</label>
            <input type="text" id="deliveryDate" name="deliveryDate" value={delivDate} readOnly></input>
        </React.Fragment>
    );
};


