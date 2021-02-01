import React, { useContext } from 'react';
import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';


export const DeliveryDate = () => {

    const { delivDate } = useContext(CurrentDataContext)

    return (
        <React.Fragment>
            <label>Delivery Date:</label>
            <input type="text" id="deliveryDate" name="deliveryDate" value={delivDate} readOnly></input>
        </React.Fragment>
    );
};


