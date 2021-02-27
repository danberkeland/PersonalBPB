
import React, { useContext, useEffect } from 'react';

import swal from '@sweetalert/with-react';

import { Button } from 'primereact/button';

import { CurrentDataContext } from '../../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../../dataContexts/StandingContext';
import { ToggleContext } from '../../../../dataContexts/ToggleContext';

import styled from 'styled-components'

import { buildCurrentOrder, 
    filterOutZeros, 
    setCurrentCartLineToQty, 
    updateCurrentLineInOrdersWithQty,
    checkForMods
} from '../../../../helpers/CartBuildingHelpers'


const OrderGrid = styled.div`
    width: 100%;
    border-radius: 10px;
    padding: 20px;
    border: none;
    display: grid;
    align-items: center;
    grid-template-columns: .5fr 3fr .5fr .5fr;
    row-gap: 4px;
    flex-shrink: 1; 
    `
const TrashCan = styled.div`
    background-color: transparent;
    border: none;
    `

const InputBox = styled.div`
    width: 50%;
    `

const Previous = styled.div`
    font-weight: bold;
    color: red;
    `

const BuildCurrentCartList = () => {

    const { orders, setOrders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { chosen, delivDate, currentCartList, setCurrentCartList, ponote, route } = useContext(CurrentDataContext)
    const { orderTypeWhole, setModifications } = useContext(ToggleContext)


    useEffect(() => {

        let currentOrderList = buildCurrentOrder(chosen.name,delivDate,orders,standing)
        let noZerosOrderList = filterOutZeros(currentOrderList)
        setModifications(checkForMods(noZerosOrderList))
        setCurrentCartList(noZerosOrderList)

    }, [chosen, delivDate, orders, setCurrentCartList, standing])



    const handleQtyModify = (prodName,qty,SO) => {
        let presentedListToModify = setCurrentCartLineToQty(prodName,currentCartList,qty)
        let updatedOrders = updateCurrentLineInOrdersWithQty(prodName,chosen, delivDate, orders, ponote, route, orderTypeWhole, qty, SO)
       
        setCurrentCartList(presentedListToModify)
        setOrders(updatedOrders) 
        
    }


    return (
        <React.Fragment>
            <OrderGrid>
            <label></label>
            <label>PRODUCT</label>
            <label>QTY</label>
            <label>PREV</label>
        {currentCartList.map(order => 
            <React.Fragment key={order["prodName"]+"b"}>
                <TrashCan>
                <Button icon="pi pi-trash" 
                    className="p-button-raised p-button-rounded p-button-warning p-button-sm"
                    value="0"
                    onClick={e => {handleQtyModify(order["prodName"],"0",order["SO"])}}
                    key={order["prodName"]+"e"} 
                    name={order["prodName"]}
                    data-qty={order["qty"]}
                    id={order["prodName"]} />
                </TrashCan>
                <label key={order["prodName"]}>{order["prodName"]}</label>   
                <InputBox>
                <input  
                    type="text" 
                    size="3"
                    maxLength="4"
                    key={order["prodName"]+"c"} 
                    id={order["prodName"]+"item"} 
                    name={order["prodName"]}
                    data-qty={order["qty"]} 
                    placeholder={order["qty"]} 
                    onKeyUp={e => {handleQtyModify(order["prodName"],e.target.value, order["SO"])}}
                    onBlur={(e) => {

                        e.target.value = ''

                    }}
                        >
                </input>
                </InputBox>
                <Previous>
                <label 
                    key={order["prodName"]+"d"}>{order["SO"] === order["qty"] ? '' : order["SO"]}
                </label>
                </Previous>

            </React.Fragment>
        )}
        </OrderGrid>
        </React.Fragment>
    );
};

export default BuildCurrentCartList