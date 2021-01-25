import React,{ useContext } from 'react';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { ProductsContext } from '../dataContexts/ProductsContext';

import { interpretEntry } from '../helpers/entryBarInterpreter'

function OrderCommandLine() {

  const [customers, setCustomer, chosen, setChosen] = useContext(CustomerContext);
  const [orders, setOrder, orderDate, setOrderDate] = useContext(OrdersContext);
  const [products, setProduct] = useContext(ProductsContext);

  const setCurrentOrder = () => [];


  const handleInput = (entry) => {
      if (entry.key === "Enter") {
        let [cust, JSdate, prodArray] = interpretEntry(entry.target.value, customers, products)
        processEntry(cust, JSdate, prodArray)
        document.getElementById("orderCommand").value = ''; //clear the command line
      }      
  };

  const processEntry = (cust, JSdate, prodArray) => {
    if (cust) {setChosen(cust)};
    if (JSdate) {setOrderDate(JSdate)};
    if (prodArray) {
      for (let prod of prodArray) {
        setCurrentOrder(...orders,prod)
      }
    }
  };

  return (        
    <div className = "orderCommandLine">
    <label>Entry:</label>
      <input type="text" id="orderCommand" name="orderCommand" onKeyUp={e => handleInput(e)}></input>
    </div>     
  );
}

export default OrderCommandLine;
