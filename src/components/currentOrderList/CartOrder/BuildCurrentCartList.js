import React, { useContext, useEffect, useState } from 'react';

import swal from '@sweetalert/with-react';

import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';

import { buildCartList, buildStandList, compileOrderList, filterOutZeros } from '../../../helpers/CartBuildingHelpers'


const BuildCurrentCartList = () => {

    const { orders, setOrders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { chosen, delivDate } = useContext(CurrentDataContext)

    const [ currentList, setCurrentList ] = useState([])


    useEffect(() => {

        let cartList = buildCartList(chosen,delivDate,orders)
        let standList = buildStandList(chosen, delivDate, standing)
        let currentOrderList = compileOrderList(cartList,standList)
        let noZerosOrderList = filterOutZeros(currentOrderList)
        setCurrentList(noZerosOrderList)

    }, [chosen, delivDate, orders, setOrders, standing])

    const handleRemove = e => {}

    const handleQtyModify = e => {}

    return (
        <React.Fragment>
        {currentList.map(order => 
            <React.Fragment key={order[1]+"b"}>
                <button 
                    className="trashButton"
                    onClick={e => {handleRemove(e)}} 
                    key={order[1]+"e"} 
                    name={order[1]}
                    id={order[1]}>🗑️</button>
                <label key={order[1]}>{order[1]}</label>   
                <input  
                    type="text" 
                    size="4"
                    maxLength="5"
                    key={order[1]+"c"} 
                    id={order[1]+"item"} 
                    name={order[1]} 
                    placeholder={order[0]} 
                    onKeyUp={e => {handleQtyModify(e)}}
                    onBlur={(e) => {

                        e.target.value = ''

                    }}
                        >
                </input>
                <label 
                    key={order[1]+"d"} 
                    className="previous">{order[5] === order[0] ? '' : order[5]}
                </label>

            </React.Fragment>
        )}
        </React.Fragment>
    );
};

export default BuildCurrentCartList