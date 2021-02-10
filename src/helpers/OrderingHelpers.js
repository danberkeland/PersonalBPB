import { useContext } from 'react'

import { CurrentDataContext } from '../dataContexts/CurrentDataContext';
import { OrdersContext } from '../dataContexts/OrdersContext';


export const CheckIfRouteisEnabled = (page) => {

    const { chosen } = useContext(CurrentDataContext)
    const { cartList } = useContext(OrdersContext)

    if (page ==="ordering"){
        if(chosen){
            if(!cartList){
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    }
}