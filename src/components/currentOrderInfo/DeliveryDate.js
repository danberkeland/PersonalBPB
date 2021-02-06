import React, { useContext } from 'react';
import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';

import { convertDatetoBPBDate } from '../../helpers/dateTimeHelpers'


export const DeliveryDate = () => {

    const { delivDate } = useContext(CurrentDataContext)

    return (
        <React.Fragment>
            <label>Delivery Date:</label>
            <input type="text" id="deliveryDate" name="deliveryDate" value={convertDatetoBPBDate(delivDate)} readOnly></input>
        </React.Fragment>
    );
};


