import React, { useEffect, useContext, useState } from 'react';

import swal from '@sweetalert/with-react';

import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';

import { convertDatetoBPBDate, convertDatetoStandingDate } from '../../../helpers/dateTimeHelpers';

const clonedeep = require('lodash.clonedeep')

const StandingOrderEntry = () => {

    const standArray = [["Baguette","2","3","3","4","5","6","2"],
                        ["Croissant","2","3","3","4","5","6","2"],
                        ["Bunz","2","3","3","4","5","6","2"]]

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

            {standArray ? standArray.map(order =>
                (<React.Fragment>
                    <label>{order[0]}</label>

                    <input type="text" size="3" maxLength="3" placeholder={order[1]} ></input>
                    <input type="text" size="3" maxLength="3" placeholder={order[2]} ></input>
                    <input type="text" size="3" maxLength="3" placeholder={order[3]} ></input>
                    <input type="text" size="3" maxLength="3" placeholder={order[4]} ></input>
                    <input type="text" size="3" maxLength="3" placeholder={order[5]} ></input>
                    <input type="text" size="3" maxLength="3" placeholder={order[6]} ></input>
                    <input type="text" size="3" maxLength="3" placeholder={order[7]} ></input>
    
                    <button>X</button>
                </React.Fragment>)) : ''}
           
           
        </React.Fragment>
        
    )
};

export default StandingOrderEntry