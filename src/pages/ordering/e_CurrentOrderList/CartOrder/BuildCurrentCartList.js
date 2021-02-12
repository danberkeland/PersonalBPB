
import React, { useContext, useEffect } from 'react';

import swal from '@sweetalert/with-react';

import { CurrentDataContext } from '../../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../../dataContexts/StandingContext';
import { ToggleContext } from '../../../../dataContexts/ToggleContext';


import { buildCurrentOrder, 
    filterOutZeros, 
    setCurrentCartLineToQty, 
    updateCurrentLineInOrdersWithQty,
} from '../../../../helpers/CartBuildingHelpers'


const BuildCurrentCartList = () => {

    const { orders, setOrders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { chosen, delivDate, currentCartList, setCurrentCartList, ponote, route } = useContext(CurrentDataContext)
    const { orderTypeWhole } = useContext(ToggleContext)


    useEffect(() => {

        let currentOrderList = buildCurrentOrder(chosen,delivDate,orders,standing)
        let noZerosOrderList = filterOutZeros(currentOrderList)
        setCurrentCartList(noZerosOrderList)

    }, [chosen, delivDate, orders, setCurrentCartList, standing])



    const handleQtyModify = (e,qty) => {

        if(isNaN(e.target.value)){
            e.target.value = ''
            swal ({
                text: "Only Numbers Please",
                icon: "warning",
                buttons: false,
                timer: 2000
              })
            return
        }
        let presentedListToModify = setCurrentCartLineToQty(e,currentCartList,qty)
        let updatedOrders = updateCurrentLineInOrdersWithQty(e,chosen, delivDate, orders, ponote, route, orderTypeWhole, qty)
        setCurrentCartList(presentedListToModify)
        setOrders(updatedOrders) 
    }


    return (
        <React.Fragment>
        {currentCartList.map(order => 
            <React.Fragment key={order[1]+"b"}>
                <button 
                    className="trashButton"
                    onClick={e => {handleQtyModify(e,"0")}} 
                    key={order[1]+"e"} 
                    name={order[1]}
                    data-qty={order[0]}
                    id={order[1]}>🗑️</button>
                <label key={order[1]}>{order[1]}</label>   
                <input  
                    type="text" 
                    size="4"
                    maxLength="5"
                    key={order[1]+"c"} 
                    id={order[1]+"item"} 
                    name={order[1]}
                    data-qty={order[0]} 
                    placeholder={order[0]} 
                    onKeyUp={e => {handleQtyModify(e,e.target.value)}}
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