import React, { useState, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { ProductsContext } from '../../../dataContexts/ProductsContext'

import { convertDatetoBPBDate } from '../../../helpers/dateTimeHelpers';
import { findAvailableProducts,decideWhetherToAddOrModify } from '../../../helpers/sortDataHelpers';




const AddStandingOrderEntry = () => {

    return (
        <div className="addAProductToCart">
           <h1>What up</h1>
        </div>
    );
};

export default AddStandingOrderEntry