
import React, { useContext, useEffect } from 'react';

import swal from '@sweetalert/with-react';

import { CurrentDataContext } from '../../../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../../dataContexts/StandingContext';
import { ToggleContext } from '../../../../dataContexts/ToggleContext';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


import { buildCurrentOrder, 
    filterOutZeros, 
    setCurrentCartLineToQty, 
    updateCurrentLineInOrdersWithQty,
} from '../../../../helpers/CartBuildingHelpers'


const BuildCurrentCartList = () => {

    const { orders, setOrders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { chosen, delivDate, currentCartList, setCurrentCartList, ponote, route } = useContext(CurrentDataContext)
    const { orderTypeWhole, setModifications } = useContext(ToggleContext)

    
    useEffect(() => {
        let currentOrderList = buildCurrentOrder(chosen.name,delivDate,orders,standing)
        let noZerosOrderList = filterOutZeros(currentOrderList)
        setCurrentCartList(noZerosOrderList)

    }, [chosen, delivDate, orders, setCurrentCartList, standing])


    /*
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
        setModifications(true)
    }
    */

    return (
        <DataTable value={currentCartList} editMode="cell" className="editable-cells-table p-datatable-sm">
            <Column field="prodName" header="Product"></Column>
            <Column field="qty" header="Quantity"></Column>
            <Column field="SO" header="QTY"></Column>
            <Column field="SO" header="PREV"></Column>
        </DataTable>
    );
};

export default BuildCurrentCartList