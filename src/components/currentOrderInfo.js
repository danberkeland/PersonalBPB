import React, { useContext } from 'react';
import { CurrentDataContext } from '../dataContexts/CurrentDataContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { Customers } from './currentOrderInfo/Customers'
import { DeliveryDate } from './currentOrderInfo/DeliveryDate'
import PONotes from './currentOrderInfo/PONotes'
import Routes from './currentOrderInfo/Routes'

const CurrentOrderInfo = () => {

const { orderTypeWhole } = useContext(CurrentDataContext)
const {cartList, standList } = useContext(OrdersContext)


const ho = {
  color: "red"
}

const so = {
  color: "rgb(66, 97, 201)"
}

let orderType
cartList ? orderType = "Cart" : standList ? orderType = "Standing" : orderType = "Holding"

  return (   
    <React.Fragment>
      {orderTypeWhole ? <h2 style={cartList ? so : standList ? so : ho }>Wholesale {orderType} Order</h2> : <h2 style={standList ? so : ho }>Retail {orderType} Order</h2>}
        <div className = "currentOrderInfo">
          <Customers /> 
          <DeliveryDate />
          <Routes />
          <PONotes />
        </div>
    </React.Fragment>
      
  );
}

export default CurrentOrderInfo;
